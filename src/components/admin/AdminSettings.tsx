import React from "react";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Switch from "@/components/ui/Switch";

const AdminSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="site-name" className="text-foreground">
            Site Name
          </Label>
          <Input id="site-name" defaultValue="CodeMentor AI" className="w-64" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="user-registration" className="text-foreground">
            Allow New User Registration
          </Label>
          <Switch id="user-registration" checked />
        </div>
        <Button className="mt-4">Save Settings</Button>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
