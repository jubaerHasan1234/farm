import { auth } from "@/auth";
import { Products } from "@/model/product-model";
import { dbConnect } from "@/service/mongo";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST API for creating a new product
export async function POST(req) {
  await dbConnect();
  const session = await auth();

  if (!session || !session.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.json();

  // Handle multiple image uploads to Cloudinary
  const imageUrls = [];
  if (Array.isArray(formData.images)) {
    for (const img of formData.images) {
      if (img?.base64) {
        try {
          const result = await cloudinary.uploader.upload(img.base64, {
            folder: "product_images",
          });
          imageUrls.push(result.secure_url);
        } catch (err) {
          console.error("Error uploading image to Cloudinary:", err);
          // Continue to upload other images even if one fails
        }
      }
    }
  }

  const newProduct = {
    productName: formData.productName,
    category: formData.category,
    description: formData.description,
    price: parseFloat(formData.price),
    unit: formData.unit,
    stock: parseInt(formData.stock),
    images: imageUrls, // Store the Cloudinary URLs
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
    // 🐛 FIX: Changed from 'new Response.json' to 'Response.json'
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// PUT API for updating an existing product
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
    // 🐛 FIX: Changed from 'new Response.json' to 'Response.json'
    return Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const productId = formData._id || formData.id;
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    // 🐛 FIX: Changed from 'new Response.json' to 'Response.json'
    return Response.json(
      { success: false, error: "Invalid product ID" },
      { status: 400 }
    );
  }

  // 📷 Image Handling: Re-upload new images, keep existing Cloudinary URLs
  const imageUrls = [];
  if (Array.isArray(formData.images)) {
    for (const img of formData.images) {
      // 1. New base64 image to upload
      if (
        typeof img.base64 === "string" &&
        img.base64.startsWith("data:image/")
      ) {
        try {
          const result = await cloudinary.uploader.upload(img.base64, {
            folder: "product_images",
          });
          imageUrls.push(result.secure_url);
        } catch (err) {
          console.error(" Error processing new base64 image:", err);
        }
      }
      // 2. Existing image (already a Cloudinary URL)
      else if (typeof img.url === "string") {
        imageUrls.push(img.url);
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
    images: imageUrls, // Store the updated list of Cloudinary URLs
    farmLocation: formData.farmLocation,
    harvestDate: formData.harvestDate || null,
    features: formData.features,
    activeStatus: formData.activeStatus,
  };

  try {
    const product = await Products.findOneAndUpdate(
      { _id: productId, createdBy: session.user.id },
      updatedProduct,
      { new: true }
    );

    if (!product) {
      // 🐛 FIX: Changed from 'new Response.json' to 'Response.json'
      return Response.json(
        { success: false, error: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    revalidatePath("/manage");
    return Response.json({ success: true, product });
  } catch (err) {
    console.error("❌ Update failed:", err);
    // 🐛 FIX: Changed from 'new Response.json' to 'Response.json'
    return Response.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

// GET API for fetching products
export async function GET(req) {
  await dbConnect();
  const session = await auth();

  if (!session || session.user?.userType !== "farmer") {
    // 🐛 FIX: Changed from 'new Response.json' to 'Response.json'
    return Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search")?.trim();
  const category = searchParams.get("category")?.toLowerCase();
  const status = searchParams.get("status");

  const filters = {
    createdBy: session.user.id,
  };

  if (search) {
    filters.productName = { $regex: search, $options: "i" };
  }

  if (category) {
    filters.category = category;
  }

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
    // 🐛 FIX: Changed from 'new Response.json' to 'Response.json'
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE API for deleting a product
export async function DELETE(req) {
  await dbConnect();
  const session = await auth();

  if (!session || !session.user?.id) {
    // 🐛 FIX: Changed from 'new Response.json' to 'Response.json'
    return Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { productId } = await req.json();

  if (!productId) {
    // 🐛 FIX: Changed from 'new Response.json' to 'Response.json'
    return Response.json(
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
      // 🐛 FIX: Changed from 'new Response.json' to 'Response.json'
      return Response.json(
        { success: false, error: "Product not found or unauthorized" },
        { status: 404 }
      );
    }

    revalidatePath("/manage");
    return Response.json({ success: true, deletedProduct });
  } catch (err) {
    console.error(err);
    // 🐛 FIX: Changed from 'new Response.json' to 'Response.json'
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
