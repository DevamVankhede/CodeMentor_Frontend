import React from "react";
import ContentManagement from "@/components/admin/ContentManagement";

const AdminContentPage = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-foreground">
        Content Management
      </h2>
      <ContentManagement />
    </div>
  );
};

export default AdminContentPage;
