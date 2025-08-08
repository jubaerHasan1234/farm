import {
  CTA,
  FarmerHeader,
  FarmersGrid,
  MenuFooter,
  Navbar,
} from "@/components";
import { getBaseUrl } from "@/lib/getBaseUrl";

// Next.js standard way to define SEO metadata for a page
export const metadata = {
  // Page Title: This is what appears in the browser tab and search results.
  title: "Meet Our Farmers | FarmDirect",

  // Page Description: A brief, keyword-rich summary of the page's content.
  description:
    "Explore our community of local farmers, discover their stories, and browse a wide selection of fresh, organic produce directly from their farms.",

  // Keywords: A list of keywords relevant to the page's content.
  keywords: [
    "farmers",
    "local farmers",
    "organic produce",
    "farm fresh",
    "buy local",
    "farmDirect",
    "farm community",
  ],

  // Open Graph metadata for social media sharing (e.g., Facebook, LinkedIn)
  openGraph: {
    title: "Meet Our Farmers | FarmDirect",
    description:
      "Explore our community of local farmers, discover their stories, and browse a wide selection of fresh, organic produce directly from their farms.",
    url: `${getBaseUrl()}/farmers`, // Replace with your actual URL
    siteName: "FarmDirect",
    images: [
      {
        url: `${getBaseUrl()}/social.jpg`, // Replace with a high-quality image
        width: 1200,
        height: 630,
        alt: "A group of smiling farmers",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter metadata for Twitter cards
  twitter: {
    card: "summary_large_image",
    title: "Meet Our Farmers | FarmDirect",
    description:
      "Explore our community of local farmers, discover their stories, and browse a wide selection of fresh, organic produce directly from their farms.",
    images: [`${getBaseUrl()}/social.jpg`], // Replace with a high-quality image
  },
};

export default function Farmers() {
  return (
    <>
      <Navbar search={false} />
      <FarmerHeader />
      <FarmersGrid />
      <CTA />
      <MenuFooter />
    </>
  );
}
