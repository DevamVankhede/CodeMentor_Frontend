import React from "react";
import UserManagement from "@/components/admin/UserManagement";

const AdminUsersPage = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-foreground">
        User Management
      </h2>
      <UserManagement />
    </div>
  );
};

export default AdminUsersPage;
