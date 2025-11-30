import React from "react";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";

const ContentManagement: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">All Content</CardTitle>
        <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
          Add New
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          No content available yet. Add some new content to get started!
        </p>
      </CardContent>
    </Card>
  );
};

export default ContentManagement;
