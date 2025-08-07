import {
  AllProduct,
  Categories,
  ChoseUs,
  Hero,
  MenuFooter,
  Navbar,
  NewsLetter,
} from "@/components/index";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { Suspense } from "react";
const baseUrl = getBaseUrl();
// ✅ Static metadata for the Home Page
export const metadata = {
  title: "FarmFresh | Home",
  description:
    "Welcome to FarmFresh – your trusted online destination for fresh organic produce directly from local farms.",
  keywords: [
    "organic",
    "fresh produce",
    "farm products",
    "online vegetables",
    "FarmFresh",
  ],
  openGraph: {
    title: "FarmFresh | Fresh from the Farm",
    description:
      "Order farm-fresh fruits, vegetables, and organic products online from local farmers.",
    url: baseUrl,
    siteName: "FarmFresh",
    images: [
      {
        url: `${baseUrl}/social.jpg`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FarmFresh | Fresh from the Farm",
    description:
      "Get the freshest organic produce delivered straight from local farms.",
    images: [`${baseUrl}/social.jpg`], // Optional
  },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <Suspense>
        <AllProduct />
      </Suspense>
      <ChoseUs />
      <NewsLetter />
      <MenuFooter />
    </>
  );
}
