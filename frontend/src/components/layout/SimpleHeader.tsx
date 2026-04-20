"use client";

import Link from "next/link";
import { IoLogOutOutline } from "react-icons/io5";
import { useAuth } from "@/hooks/stores/useAuth";

export function SimpleHeader() {
  const { logout, isAuthenticated } = useAuth();

  return (
    <header className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-black text-primary-600 tracking-tighter"
        >
          Guestly
        </Link>

        {isAuthenticated && (
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-red-500 transition-colors"
          >
            <IoLogOutOutline size={20} />
            Cerrar sesión
          </button>
        )}
      </div>
    </header>
  );
}
