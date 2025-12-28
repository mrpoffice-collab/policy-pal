"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsNav = [
  { href: "/settings", label: "Account", icon: "user" },
  { href: "/settings/team", label: "Team", icon: "users" },
  { href: "/settings/billing", label: "Billing", icon: "credit-card" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="flex gap-8">
          {/* Sidebar */}
          <nav className="w-48 flex-shrink-0">
            <ul className="space-y-1">
              {settingsNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Content */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
