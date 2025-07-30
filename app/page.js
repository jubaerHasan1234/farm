import {
  AllProduct,
  Categories,
  ChoseUs,
  Hero,
  MenuFooter,
  Navbar,
  NewsLetter,
} from "@/components/index";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <AllProduct />
      <ChoseUs />
      <NewsLetter />
      <MenuFooter />
    </>
  );
}
