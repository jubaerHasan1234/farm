import { Breadcrumb, MenuFooter, Navbar, ProductDetails } from "@/components";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { getUserById } from "@/lib/getUserById";
import { getProductById } from "@/lib/productQueries";
export async function generateMetadata({ params }) {
  const baseUrl = getBaseUrl();
  const product = await getProductById(params.id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product does not exist.",
      robots: "noindex, nofollow",
    };
  }

  const title = `${product.productName} | FarmFresh`;
  const description =
    product.description || "Fresh organic produce delivered to your doorstep";

  const imageUrl = product.images?.[0] || `${baseUrl}/social.jpg`;

  // Dynamically add the productName to the keywords array
  const keywords = [
    "fresh produce",
    "organic",
    "farm fresh",
    "buy local",
    "FarmFresh",
    product.productName,
  ].filter(Boolean); // Filters out any undefined or null values

  return {
    title,
    description,
    keywords, // The updated keywords array is used here
    openGraph: {
      title,
      description,
      url: `${baseUrl}/products/${product._id}`,
      images: [imageUrl],
      siteName: "FarmFresh",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }) {
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
    <>
      <Navbar menu={false} search={false} />
      <Breadcrumb />
      <ProductDetails product={product} user={user} />
      <MenuFooter />
    </>
  );
}
