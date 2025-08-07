import { Modal } from "@/components";
import ReviewForm from "@/components/Review/ReviewForm";
import { getUserById } from "@/lib/getUserById";
import { getProductById } from "@/lib/productQueries";

export default async function ReviewFormPage({ params }) {
  const product = await getProductById(params.id);
  const user = await getUserById(product?.createdBy);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Product Not Found</h1>
      </div>
    );
  }

  return (
    <Modal>
      {" "}
      <ReviewForm product={product} user={user} />{" "}
    </Modal>
  );
}
