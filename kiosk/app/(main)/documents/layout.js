import React from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page-header";
import { FileUp, FolderOpen } from "lucide-react";

export const metadata = {
  title: "My Documents - Kiosk",
  description: "Upload and manage your medical documents",
};

export default function DocumentsLayout({ children }) {
  let activeTab = "upload";

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader icon={<FolderOpen />} title="My Medical Documents" />

      <Tabs defaultValue={activeTab} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <TabsList className="md:col-span-1 bg-muted/30 border rounded-md h-auto flex sm:flex-row md:flex-col w-full p-4 md:p-3 space-x-4 md:space-x-0 md:space-y-4">
          <TabsTrigger
            value="upload"
            className="flex-1 md:flex md:items-center md:justify-start md:px-6 md:py-5 w-full text-lg font-semibold"
            asChild
          >
            <Link href="/documents/upload" className="flex items-center gap-3 w-full">
              <FileUp className="h-6 w-6 mr-3 hidden md:inline" />
              Upload Documents
            </Link>
          </TabsTrigger>

          <TabsTrigger
            value="view"
            className="flex-1 md:flex md:items-center md:justify-start md:px-6 md:py-5 w-full text-lg font-semibold"
            asChild
          >
            <Link href="/documents/view" className="flex items-center gap-3 w-full">
              <FolderOpen className="h-6 w-6 mr-3 hidden md:inline" />
              View Documents
            </Link>
          </TabsTrigger>
        </TabsList>

        <div className="md:col-span-3">{children}</div>
      </Tabs>
    </div>
  );
}
