"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
      title="Sign out"
    >
      <LogOut className="w-5 h-5" />
    </button>
  );
}
