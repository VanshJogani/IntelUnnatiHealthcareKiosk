import React from 'react';
import { TabsContent } from "@/components/ui/tabs"
import { getPendingDoctors, getVerifiedDoctors } from '@/actions/admin';
import PendingDoctors from './_component/pending-doctors';
import VerifiedDoctors from './_component/verified-doctors';
const AdminPage = async() => {
    const [pendingDoctorsData, verifiedDoctorsData]=
    await Promise.all([
        getPendingDoctors(),
        getVerifiedDoctors(),
    ])



  return(
  <div>
    <TabsContent value="pending" className="border-none p-0">
        <PendingDoctors doctors={pendingDoctorsData.doctors || []} />
    </TabsContent>
    <TabsContent value="doctors" className="border-none p-0">
         <VerifiedDoctors doctors={verifiedDoctorsData.doctors || []} />
    </TabsContent>
  </div>
  
  )
};

export default AdminPage;
