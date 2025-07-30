import { MenuFooter, Navbar, Register } from "@/components";

export default function RegisterPage() {
  return (
    <>
      <Navbar searchAndUserProfile={false} />
      <Register />
      <MenuFooter />
    </>
  );
}
