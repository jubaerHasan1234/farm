import Link from "next/link";
import RegisterForm from "./RegisterForm";
import RegisterHeader from "./RegisterHeader";

export default function Register() {
  return (
    <div className="max-w-6xl mx-auto ">
      <RegisterHeader />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 py-8 px-8 shadow-xl rounded-2xl">
          <RegisterForm />

          {/* <!-- Login Link --> */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?
              <Link
                href="/login"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
