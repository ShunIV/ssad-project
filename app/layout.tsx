"use client";

import { useState, useEffect, useRef } from "react";
import "./globals.css";

const items = [
  { name: "Dashboard", href: "/dashboard", logo: "pie.svg" },
  { name: "Messages", href: "/messages", logo: "globe.svg" },
  { name: "Files", href: "/files", logo: "file.svg" },
  { name: "Logout", href: "/logout", logo: "logout.svg" },
];

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("Home");
  const drawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Determine current page based on window location
    const currentPageName =
      items.find((item) => item.href === window.location.pathname)?.name ||
      "Home";
    setCurrentPage(currentPageName);
  }, []);

  const isActive = (href: string) => window.location.pathname === href;

  return (
    <div>
      {/* Drawer toggle button */}
      <div className="fixed z-50 top-4 left-4 flex items-center">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="text-white bg-gray-800 p-2 rounded cursor-pointer"
        >
          <div className={`hamburger ${isOpen ? "open" : ""}`}>
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </div>
        </div>
        <span className="ml-4 text-white font-bold text-xl">{currentPage}</span>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
        style={{ width: "250px" }}
      >
        <ul className="p-4">
          {/* Logo */}
          <li className="p-2" onClick={() => setIsOpen(false)}>
            <a href="/" className="flex items-center">
              <img src="/logo.svg" alt="Logo" className="h-10 w-10 mr-2" />
              <p className="font-bold text-lg">GroupGuard</p>
            </a>
          </li>

          {/* Navigation Links */}
          {items.map((item) => (
            <li key={item.href} className="px-2 py-4 group">
              <a
                href={item.href}
                className={`flex items-center transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  isActive(item.href)
                    ? "text-yellow-400"
                    : "hover:text-yellow-400"
                }`}
              >
                <img
                  src={item.logo}
                  alt={item.name}
                  className="h-6 w-6 mr-2 "

                />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        <Drawer />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
