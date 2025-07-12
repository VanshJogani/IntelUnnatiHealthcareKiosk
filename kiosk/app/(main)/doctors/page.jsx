"use client";
import { SPECIALTIES } from '@/lib/specialities';
import Link from 'next/link';
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import AppointmentBot from "@/components/AppointmentBot";
import DiseasePredictor from '@/components/DiseasePredictor';
import FloatingWidgets from '@/components/FloatingWidgets';

const SpecialitiesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPredictor, setShowPredictor] = useState(false);

  return (
    <>
      <FloatingWidgets />

      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-green mb-2">Find Your Doctor</h1>
        <p className="text-muted-foreground text-lg">
          Browse by speciality or search by doctor name
        </p>
      </div>

      <Tabs defaultValue="specialty" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="specialty">By Specialty</TabsTrigger>
          <TabsTrigger value="name">By Name</TabsTrigger>
        </TabsList>

        <TabsContent value="specialty">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SPECIALTIES.map((specialty) => (
              <Link key={specialty.name} href={`/doctors/${specialty.name}`}>
                <Card className="hover:border-emerald-700/40 transition-all cursor-pointer border-emerald-900/20 h-full">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                    <div className="w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center mb-4">
                      <div className="text-emerald-400">{specialty.icon}</div>
                    </div>
                    <h3 className="font-medium text-white">{specialty.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <AppointmentBot />
          </div>
        </TabsContent>

        <TabsContent value="name">
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search for a doctor by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-emerald-900/20 focus:border-emerald-600/40"
              />
            </div>
            
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-900/20 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Search Doctors</h3>
              <p className="text-muted-foreground">
                Enter a doctor's name to find their profile and book appointments
              </p>
            </div>
            <div className="mt-8 flex justify-center">
              <AppointmentBot />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SpecialitiesPage;
