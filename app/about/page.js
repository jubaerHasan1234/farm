import {
  AboutCTA,
  Count,
  HeroSection,
  MenuFooter,
  MissionAndVision,
  Navbar,
  Team,
  Values,
} from "@/components";
import { getBaseUrl } from "@/lib/getBaseUrl";

// Next.js standard way to define SEO metadata for a page
export const metadata = {
  // Page Title: What appears in the browser tab and search results.
  title: "About Us | FarmDirect",

  // Page Description: A brief summary of your company's mission and vision.
  description:
    "Learn about FarmDirect's mission to connect consumers with local, organic farmers. Discover our values, our team, and our commitment to sustainable agriculture.",

  // Keywords: Relevant keywords for search engines.
  keywords: [
    "about us",
    "farmDirect",
    "mission",
    "vision",
    "team",
    "values",
    "sustainable agriculture",
    "local farmers",
  ],

  // Open Graph metadata for social media sharing (e.g., Facebook, LinkedIn)
  openGraph: {
    title: "About Us | FarmDirect",
    description:
      "Learn about FarmDirect's mission to connect consumers with local, organic farmers. Discover our values, our team, and our commitment to sustainable agriculture.",
    url: `${getBaseUrl()}/about`, // Replace with your actual URL
    siteName: "FarmDirect",
    images: [
      {
        url: `${getBaseUrl()}/social.jpg`, // Replace with a high-quality image
        width: 1200,
        height: 630,
        alt: "FarmDirect team and community members",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter metadata for Twitter cards
  twitter: {
    card: "summary_large_image",
    title: "About Us | FarmDirect",
    description:
      "Learn about FarmDirect's mission to connect consumers with local, organic farmers. Discover our values, our team, and our commitment to sustainable agriculture.",
    images: [`${getBaseUrl()}/social.jpg`], // Replace with a high-quality image
  },
};

export default function About() {
  return (
    <>
      <Navbar search={false} />
      <HeroSection />
      <MissionAndVision />
      <Values />
      <Count />
      <Team />
      <AboutCTA />
      <MenuFooter />
    </>
  );
}
