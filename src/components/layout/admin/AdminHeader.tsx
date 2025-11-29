import React from "react";
import { Menu } from "lucide-react";
import Button from "@/components/ui/Button";

interface AdminHeaderProps {
  toggleSidebar?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="w-full bg-card border-b border-border p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
      {toggleSidebar && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="w-5 h-5 text-muted-foreground" />
        </Button>
      )}
    </header>
  );
};

export default AdminHeader;
