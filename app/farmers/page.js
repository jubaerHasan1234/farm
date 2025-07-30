import {
  CTA,
  FarmerHeader,
  FarmersGrid,
  MenuFooter,
  Navbar,
} from "@/components";

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
