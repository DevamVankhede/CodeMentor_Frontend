import React from "react";
import { motion } from "framer-motion";
import { Home, Users, Code, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Content", href: "/admin/content", icon: Code },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen = true,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: isOpen ? 0 : -250 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col bg-card border-r border-border h-screen p-4 shadow-lg z-40 fixed top-0 left-0",
        isOpen ? "w-64" : "w-0 overflow-hidden"
      )}
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-primary">Admin Console</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-2 rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-2">
        {adminNavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 p-3 rounded-md text-foreground hover:bg-secondary transition-colors"
          >
            <item.icon className="w-5 h-5 text-primary" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <button className="flex items-center gap-3 p-3 rounded-md text-destructive hover:bg-destructive/10 w-full">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;
