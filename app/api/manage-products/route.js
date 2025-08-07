import { auth } from "@/auth"; // or however you're accessing session
import { Products } from "@/model/product-model";
import { dbConnect } from "@/service/mongo";
import { writeFile } from "fs/promises";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import path from "path";
import { v4 as uuidv4 } from "uuid";
export async function POST(req) {
  await dbConnect();
  const session = await auth();

  if (!session || !session.user?.id) {
    return new Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.json();
  // image upload
  const imagePaths = [];
  for (const img of formData.images) {
    const base64Data = img.base64.split(",")[1];
    const ext = img.base64.split(";")[0].split("/")[1]; // e.g., "png" or "jpeg"
    const filename = `${Date.now()}-${uuidv4()}.${ext}`;
    const filePath = path.join(process.cwd(), "public/uploads", filename);

    await writeFile(filePath, Buffer.from(base64Data, "base64"));
    imagePaths.push(`/uploads/${filename}`);
  }
  const newProduct = {
    productName: formData.productName,
    category: formData.category,
    description: formData.description,
    price: parseFloat(formData.price),
    unit: formData.unit,
    stock: parseInt(formData.stock),
    images: imagePaths,
    farmLocation: formData.farmLocation,
    harvestDate: formData.harvestDate || null,
    features: formData.features,
    createdBy: session.user.id,
    activeStatus: true,
  };

  try {
    const product = await Products.create(newProduct);
    revalidatePath("/manage");
    return Response.json({ success: true, product });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  await dbConnect();
  const session = await auth();

  const formData = await req.json();

  // 🔐 Auth check
  if (
    !session ||
    session.user?.userType !== "farmer" ||
    session.user.id !== formData.createdBy
  ) {
    return Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const productId = formData._id || formData.id;
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return Response.json(
      { success: false, error: "Invalid product ID" },
      { status: 400 }
    );
  }

  // 📷 Image Handling

  const imagePaths = [];

  if (Array.isArray(formData.images)) {
    for (const img of formData.images) {
      const base64String = img?.base64;

      // 1. Already uploaded image (reuse path)
      if (
        typeof base64String === "string" &&
        base64String.startsWith("/uploads/")
      ) {
        imagePaths.push(base64String);
        continue;
      }

      // 2. New base64 image to upload
      if (
        typeof base64String === "string" &&
        base64String.startsWith("data:image/")
      ) {
        try {
          const [meta, base64Data] = base64String.split("base64,");
          const ext = meta.split("/")[1].split(";")[0] || "png";
          const filename = `${Date.now()}-${uuidv4()}.${ext}`;
          const filePath = path.join(process.cwd(), "public/uploads", filename);

          await writeFile(filePath, Buffer.from(base64Data, "base64"));
          imagePaths.push(`/uploads/${filename}`);
        } catch (err) {
          console.error(" Error processing base64 image:", err);
        }
      }
    }
  }

  // 🧾 Prepare updated product data
  const updatedProduct = {
    productName: formData.productName,
    category: formData.category,
    description: formData.description,
    price: parseFloat(formData.price),
    unit: formData.unit,
    stock: parseInt(formData.stock),
    images: imagePaths,
    farmLocation: formData.farmLocation,
    harvestDate: formData.harvestDate || null,
    features: formData.features,
    activeStatus: formData.activeStatus,
    // productStatus and createdBy are NOT updated intentionally
  };

  try {
    const product = await Products.findOneAndUpdate(
      { _id: productId, createdBy: session.user.id },
      updatedProduct,
      { new: true }
    );

    if (!product) {
      return Response.json(
        { success: false, error: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    revalidatePath("/manage");

    return Response.json({ success: true, product });
  } catch (err) {
    console.error("❌ Update failed:", err);
    return Response.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

//  get api
// app/api/products/route.js

export async function GET(req) {
  await dbConnect();

  const session = await auth();

  if (!session || session.user?.userType !== "farmer") {
    return new Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search")?.trim();
  const category = searchParams.get("category")?.toLowerCase();
  const status = searchParams.get("status"); // could be "true", "false", or "out-of-stock"

  const filters = {
    createdBy: session.user.id,
  };

  if (search) {
    filters.productName = { $regex: search, $options: "i" };
  }

  if (category) {
    filters.category = category;
  }

  // ✅ Apply out-of-stock logic via status
  if (status === "out-of-stock") {
    filters.stock = 0;
  } else if (status === "true" || status === "false") {
    filters.activeStatus = status === "true";
  }

  const PAGE_SIZE = 6;
  const skip = (page - 1) * PAGE_SIZE;

  try {
    const [products, total] = await Promise.all([
      Products.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(PAGE_SIZE),
      Products.countDocuments(filters),
    ]);
    revalidatePath("/manage");
    return Response.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
// delete api
export async function DELETE(req) {
  await dbConnect();
  const session = await auth();

  if (!session || !session.user?.id) {
    return new Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { productId } = await req.json(); // expects { productId: "..." }

  if (!productId) {
    return new Response.json(
      { success: false, error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const deletedProduct = await Products.findOneAndDelete({
      _id: productId,
      createdBy: session.user.id,
    });

    if (!deletedProduct) {
      return new Response.json(
        { success: false, error: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    revalidatePath("/manage"); // revalidate the product list page
    return Response.json({ success: true, deletedProduct });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
