import React from "react";
import AdminSettings from "@/components/admin/AdminSettings";

const AdminSettingsPage = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-foreground">
        Admin Settings
      </h2>
      <AdminSettings />
    </div>
  );
};

export default AdminSettingsPage;
