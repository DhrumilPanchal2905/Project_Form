import { metaInfo } from "@/constants/pageMetaInfo";
import HomePage from "@/components/HomePage";

export const metadata = {
  title: metaInfo.home.title,
  description: metaInfo.home.description,
  alternates: { canonical: "https://dev.dhrumilpanchal.in" },
  openGraph: {
    url: `${process.env.NEXT_APP_BASE_URL}`,
    title: metaInfo.home.title,
    images: `${process.env.NEXT_APP_BASE_URL}/images/og-image.png`,
    description: metaInfo.home.description,
    type: "article",
  },
  twitter: {
    title: "Form | Dhrumil Panchal",
    description:
      "Explore Dhrumil Panchal's portfolio showcasing MERN stack projects and web development expertise.",
    card: "summary_large_image",
  },
  robots: {
    index: process.env.NEXT_APP_ENVIRONMENT === "production",
  },
};

export default function Home() {
  return (
    <>
      <HomePage />
    </>
  );
}
