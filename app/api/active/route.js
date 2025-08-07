import { auth } from "@/auth";
import { Products } from "@/model/product-model";
import { dbConnect } from "@/service/mongo";
import { revalidatePath } from "next/cache";

export async function PUT(req) {
  await dbConnect();
  const session = await auth();

  if (!session || !session.user?.id) {
    return new Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const formData = await req.json();

  const productId = formData._id || formData.id;

  if (!productId) {
    return new Response.json(
      { success: false, error: "Product ID is required" },
      { status: 400 }
    );
  }

  const updatedProduct = {
    activeStatus: formData.activeStatus,
    // Don't update productStatus or createdBy unless intentional
  };

  try {
    const product = await Products.findOneAndUpdate(
      { _id: productId, createdBy: session.user.id },
      updatedProduct,
      { new: true } // return the updated document
    );

    if (!product) {
      return new Response.json(
        { success: false, error: "Product not found or unauthorized" },
        { status: 404 }
      );
    }
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
