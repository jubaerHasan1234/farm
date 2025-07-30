import { Login, MenuFooter, Navbar } from "@/components";

export default function LoginPage() {
  return (
    <>
      <Navbar searchAndUserProfile={false} />

      <Login />
      <MenuFooter />
    </>
  );
}
