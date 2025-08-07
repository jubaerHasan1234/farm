import { auth } from "@/auth";
import { Products } from "@/model/product-model";
import { dbConnect } from "@/service/mongo";
import { revalidatePath } from "next/cache";

export async function GET(req, { params }) {
  await dbConnect();

  const session = await auth();

  if (!session || session.user?.userType !== "farmer") {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401 }
    );
  }

  const productId = params.id;
  console.log(productId);
  if (!productId) {
    return new Response(
      JSON.stringify({ success: false, error: "Product ID is required" }),
      { status: 400 }
    );
  }

  try {
    const product = await Products.findOne({
      _id: productId,
      createdBy: session.user.id,
    });

    if (!product) {
      return new Response(
        JSON.stringify({ success: false, error: "Product not found" }),
        { status: 404 }
      );
    }

    revalidatePath("/manage"); // optional, to revalidate product list page if needed

    return new Response(JSON.stringify({ success: true, data: product }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500 }
    );
  }
}
