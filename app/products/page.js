import { MenuFooter, Navbar } from "@/components";
import {
  FiltersAndProduct,
  UserProductsPageHeader,
} from "@/components/Products/UserProduct";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { Suspense } from "react";

// Next.js standard way to define SEO metadata for a page
export const metadata = {
  // Page Title: What appears in the browser tab and search results.
  title: "Products | FarmDirect",

  // Page Description: A brief summary of your company's mission and vision.
  description:
    "Explore our wide selection of fresh, organic produce directly from local farmers. Shop our products and support sustainable agriculture.",

  // Keywords: Relevant keywords for search engines.
  keywords: [
    "products",
    "farmDirect",
    "organic produce",
    "farm fresh",
    "buy local",
    "farm community",
    "farmDirect products",
    "farmDirect organic produce",
    "farmDirect farm fresh",
    "farmDirect buy local",
    "farmDirect farm community",
  ],

  // Open Graph metadata for social media sharing (e.g., Facebook, LinkedIn)
  openGraph: {
    title: "Products | FarmDirect",
    description:
      "Explore our wide selection of fresh, organic produce directly from local farmers. Shop our products and support sustainable agriculture.",
    url: `${getBaseUrl()}/products`, // Replace with your actual URL
    siteName: "FarmDirect",
    images: [
      {
        url: `${getBaseUrl()}/social.jpg`, // Replace with a high-quality image
        width: 1200,
        height: 630,
        alt: "FarmDirect products and organic produce",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter metadata for Twitter cards
  twitter: {
    card: "summary_large_image",
    title: "Products | FarmDirect",
    description:
      "Explore our wide selection of fresh, organic produce directly from local farmers. Shop our products and support sustainable agriculture.",
    images: [`${getBaseUrl()}/social.jpg`], // Replace with a high-quality image
  },
};

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <UserProductsPageHeader />
      <Suspense>
        <FiltersAndProduct />
      </Suspense>
      <MenuFooter />
    </>
  );
}
