import { BreadcrumbCreate, CreateProduct, Footer, Navbar } from "@/components";

export default function CreateProductPage() {
  return (
    <>
      <Navbar search={false} cartAndFavourite={false} />
      <BreadcrumbCreate />
      <CreateProduct />
      <div className="pb-8">
        <Footer />
      </div>
    </>
  );
}
