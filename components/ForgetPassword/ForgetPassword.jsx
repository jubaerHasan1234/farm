import Link from "next/link";
import ForgetPasswordForm from "./ForgetPasswordForm";

export default function ForgetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* <!-- Header --> */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-500 p-3 rounded-full">
              <i className="fas fa-key text-white text-2xl"></i>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>
        {/* <!-- Reset Password Form --> */}
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl">
          <ForgetPasswordForm />
          {/* <!-- Back to Login Link --> */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
