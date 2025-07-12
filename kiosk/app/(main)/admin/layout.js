import { verifyAdmin } from "@/actions/admin";
import { redirect } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, AlertCircle, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Admin Settings - Kiosk",
  description: "Manage doctors, patients, and platform settings",
};

export default async function AdminLayout({ children }) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    redirect("/onboarding");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader icon={<ShieldCheck />} title="Admin Settings" />

      <Tabs defaultValue="pending" className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <TabsList className="md:col-span-1 bg-muted/30 border h-auto p-3 md:p-2 rounded-lg flex sm:flex-row md:flex-col w-full md:space-y-3 sm:space-x-3 md:space-x-0">
          <TabsTrigger
            value="pending"
            className="w-full text-md py-4 px-4 md:text-base md:py-5 md:px-6 flex items-center justify-start"
          >
            <AlertCircle className="h-5 w-5 mr-3" />
            Pending Verification
          </TabsTrigger>

          <TabsTrigger
            value="doctors"
            className="w-full text-md py-4 px-4 md:text-base md:py-5 md:px-6 flex items-center justify-start"
          >
            <Users className="h-5 w-5 mr-3" />
            Doctors
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <div className="md:col-span-3 flex flex-col gap-4">{children}</div>
      </Tabs>
    </div>
  );
}