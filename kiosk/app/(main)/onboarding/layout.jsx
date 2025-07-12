import React from 'react'
import { redirect } from 'next/navigation'; // ✅ Make sure this is imported
import { getCurrentUser } from "@/actions/onboarding";
export const metadata ={
    title: "Onboarding-Kiosk",
    description: "Complete your profile to get started with Kiosk"
}

const OnboardingLayout = async ({children}) =>{
      const user = await getCurrentUser();

  // Redirect users who have already completed onboarding
  if (user) {
    if (user.role === "PATIENT") {
      redirect("/doctors");
    } else if (user.role === "DOCTOR") {
     
      if (user.verificationStatus === "VERIFIED") {
        redirect("/doctor");
      } else {
        redirect("/doctor/verification");
      }
    } else if (user.role === "ADMIN") {
      redirect("/admin");
    }
  }

  return <div className="cointainer mx-auto px-4 py-12">
    <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-green-mb-2"> Welcome To Kiosk</h1>
            <p className="text-muted-foreground text-lg">Tell us how you want to use our platform</p>
        </div>
    </div>
    {children}</div>
}
export default OnboardingLayout;