import { ForgetPassword, MenuFooter, Navbar } from "@/components";

export default function ForgetPasswordPage() {
  return (
    <>
      <Navbar searchAndUserProfile={false} />
      <ForgetPassword /> <MenuFooter />
    </>
  );
}
