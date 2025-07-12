
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Calendar,
  CreditCard,
  ShieldCheck,
  Stethoscope,
  User,
  Upload
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import { Badge } from "./ui/badge";


export default async function Header() {
  const user = await checkUser();
  

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <img
            src="/logo.jpg"
            alt="Kiosk Logo"
            width={200}
            height={60}
            className="h-10 w-auto object-contain rounded-full"
          />
        </Link>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          <SignedIn>
            {/* Role-based Navigation */}
            {user?.role === "ADMIN" && (
              <Link href="/admin">
                <Button variant="outline" className="hidden md:inline-flex gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>
            )}

            {user?.role === "DOCTOR" && (
              <Link href="/doctor">
                <Button variant="outline" className="hidden md:inline-flex gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Doctor Dashboard
                </Button>
              </Link>
            )}

            {user?.role === "PATIENT" && (
              <>
                <Link href="/appointments">
                  <Button variant="outline" className="hidden md:inline-flex gap-2">
                    <Calendar className="h-4 w-4" />
                    My Appointments
                  </Button>
                </Link>

                {/* Upload Documents Badge for Patient Only */}
                <Link href="/documents">
                <Badge
                  variant="outline"
                  className="h-9 bg-emerald-900/20 border-emerald-700/30 px-3 py-1 flex items-center gap-2"
                >
                  <Upload className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Documents</span>
                </Badge>
              </Link>
            </>
            )}

            {user?.role === "UNASSIGNED" && (
              <Link href="/onboarding">
                <Button variant="outline" className="hidden md:inline-flex gap-2">
                  <User className="h-4 w-4" />
                  Complete Profile
                </Button>
              </Link>
            )}
          </SignedIn>
          

          {/* Auth buttons */}
          <SignedOut>
            <SignInButton>
              <Button variant="secondary">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
