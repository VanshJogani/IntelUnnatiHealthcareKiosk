import React from "react";
import { getCurrentUser } from "@/actions/onboarding";
import { redirect } from "next/navigation";

const MainLayout = async ({ children }) => {
  const user = await getCurrentUser();

  // if (!user?.role) {
  //   // Redirect to onboarding if no role assigned
  //   redirect("/onboarding");
  // }

  // If user tries to access onboarding but already has a role, redirect accordingly
  // (optional, if you want to protect onboarding route here)
  // if (user?.role && window.location.pathname === "/onboarding") {
  //   redirect(user.role === "DOCTOR" ? "/doctor/verification" : "/doctors");
  // }

  return <div className="container mx-auto my-20">{children}</div>;
};

export default MainLayout;
