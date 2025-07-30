import { MenuFooter, Navbar } from "@/app/components/index";
import "../globals.css";

export const metadata = {
  title: "Local Farmer Booking - Fresh Produce Direct from Farmers",
  description:
    "Discover fresh, organic produce straight from trusted local farmers. Book your order easily and support farm-to-table living",
};

export default function RootLayout({ children }) {
  'test'
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          rel="stylesheet"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* Dark mode loader (runs before hydration) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                const theme = localStorage.getItem("theme");
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                if (theme === "dark" || (!theme && prefersDark)) {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar menu={true} />
        {children}
        <MenuFooter />
      </body>
    </html>
  );
}
