"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, FolderRoot, Mail } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Here we would normally implement Firebase Auth listener to redirect if not admin
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white p-6 relative">
        <h2 className="text-xl font-bold tracking-tight mb-8">
          Admin<span className="text-blue-600">Panel</span>
        </h2>
        <nav className="space-y-2">
          <SidebarLink href="/admin" icon={<Home size={20} />} label="Dashboard" active={pathname === "/admin"} />
          <SidebarLink href="/admin/blog/new" icon={<FileText size={20} />} label="New Blog Post" active={pathname === "/admin/blog/new"} />
          <SidebarLink href="/admin/projects" icon={<FolderRoot size={20} />} label="Manage Projects" active={pathname === "/admin/projects"} />
        </nav>
        
        <div className="absolute bottom-6 left-6 right-6">
          <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
