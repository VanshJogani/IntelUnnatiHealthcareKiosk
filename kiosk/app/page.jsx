"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Library } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { features, testimonials } from "@/lib/data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { FaceAuth } from "@/components/FaceAuth";
import { useState } from "react";


export default function Home() {
  const [showFaceAuth, setShowFaceAuth] = useState(false);
  const [faceMode, setFaceMode] = useState("login");
  return (
    <div className="bg-background">
      {/* Floating tab for Face ID Login */}
      <button
        onClick={() => setShowFaceAuth(true)}
        className="fixed bottom-8 right-8 z-50 bg-emerald-700 text-white rounded-full shadow px-6 py-3 font-semibold text-base hover:bg-emerald-800 focus:outline-none"
      >
        Face ID Login
      </button>
      {showFaceAuth && (
        <div
          className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center"
          onClick={() => setShowFaceAuth(false)}
        >
          <div
            className="bg-white text-blue-900 rounded-2xl shadow-2xl p-0 min-w-[340px] max-w-[90vw] max-h-[90vh] border border-blue-200 relative flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowFaceAuth(false)}
              className="text-blue-500 hover:text-blue-700 text-2xl absolute top-3 right-4 bg-transparent rounded-full focus:outline-none"
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex justify-center gap-3 mt-7 mb-3">
              <button
                onClick={() => setFaceMode('login')}
                className={`px-5 py-2 rounded-full font-semibold text-base transition ${faceMode === 'login' ? 'bg-blue-600 text-white shadow' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
              >
                Login
              </button>
              <button
                onClick={() => setFaceMode('register')}
                className={`px-5 py-2 rounded-full font-semibold text-base transition ${faceMode === 'register' ? 'bg-blue-600 text-white shadow' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
              >
                Register
              </button>
            </div>
            <div className="px-6 pb-6">
              <FaceAuth mode={faceMode} />
            </div>
          </div>
        </div>
      )}
      
      <section className="relative overflow-hidden py-32">
        <div className="cointainer mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 items-center">
              <div className="space-y-8">
                <Badge variant="outline" className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium" >
                Healthcare Made Simple</Badge><br />
                <h1 className="text-3xl md:text-4.5xl lg:text-5xl font-bold text-white leading-tight"> A Unified Healthcare Platform<br /> <span> Connect Anyplace, Anytime or Anywhere</span></h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-md">
                  Book appointments, manage your documents, connect with doctors and hospitals through this platform
                </p>
                <div className="flex flex-col sm:flex-row gap-4 ">
                  <Button
                  asChild
                  size="lg"
                  className="bg-emerald-600 text-white hover:bg-emerald-700 "> 
                  <Link href="/onboarding" className="flex items-center">Get Started<ArrowRight className="ml-2 h-4 w-4" /></Link> 
                  </Button>
                  <Button
    asChild
    size="lg"
    variant="outline"
    className="text-white border-white hover:border-emerald-400"
  >
    <Link href="/hospitals">Find Hospitals</Link>
  </Button>
                </div>
              </div>
               <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
                 <Image src="/images.jpeg" alt="Doctor Consultation" fill priority className="object-cover md:pt-14 rounded-xl"/>
          </div>
              </div>
        </div>
      </section>
      <section className="py-20 bg-muted/30">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
      <p>Our platform makes healthcare accessible with just a few clicks</p>
    </div>
    <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{features.map((feature, index) => {
      return (
        <Card key={index}
        className="border-emerald-900/20 hover-border-emerald-800/40 transitio-all
        duration-300" >
  <CardHeader className="pb-2">
    <div className="bg-emerald-900/20 p-3 rounded-lg w-fit mb-4">{feature.icon}</div>
    <CardTitle className="text-xl font-semibold text-white">{feature.title}</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foregroun">{feature.description}</p>
  </CardContent>
 
</Card>
      )
    })}</div>
  </div>
</section>
<section className="py-20 bg-muted/30">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <Badge variant="outline" className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium" >
                Success stories</Badge><br />
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What our users say!!!</h2>
      <p>Hear from patients and users who use our app</p>
    </div>
    <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{testimonials.map((testimonials, index) => {
      return (
        <Card key={index}
        className="border-emerald-900/20 hover-border-emerald-800/40 transitio-all
        duration-300" >

   
  
  <CardContent className="pt-6">
   <div className="flex items-center mb-4">
    <div className="w-12 h-12 rounded-full bg-emerald-900/20 flex items-center
    justify-center mr-4" >
      <span className="text-emerald-400 font bold">{testimonials.initials}</span>
    </div>
    <div>
      <h4>{testimonials.name}</h4>
      <p className="text-sm text-muted-foreground">{testimonials.role}</p>
    </div>
   </div>

   <p className="text-muted-foreground">
    &quot;{testimonials.quote}&quot;
    </p>
  </CardContent>
 
</Card>
      )
    })}</div>
  </div>
</section>

<section className="py-20 ">
  <div className="container mx-auto px-4">
   
   
        <Card 
        className="bg-emerald-900/10 border border-emerald-600/30 shadow-lg backdrop-blur-sm rounded-xl">
          <CardContent className="pt-6 md:p-12 lg:p-16 relative overflow-hidden">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to take control of your healthcare?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of users who have simplified their healthcare
                journey with our platform.Get started today and experience 
                healthcare the way it should be.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
              size="lg"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              asChild>
                <Link href="/sign-up">Sign up Now</Link>
              </Button>
            </div>

          </CardContent>
</Card>
      </div>

</section>
      </div>
      

      
  );
}
