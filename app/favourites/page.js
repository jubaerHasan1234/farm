import { Favourite, MenuFooter, Navbar } from "@/components";

export default function FavouritesPage() {
  return (
    <>
      <Navbar search={false} />
      <Favourite />
      <MenuFooter />
    </>
  );
}
