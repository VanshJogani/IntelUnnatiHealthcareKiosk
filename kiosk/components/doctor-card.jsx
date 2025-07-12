"use client"
import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Star, User } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const DoctorCard = ({ doctor }) => {
  return (
    <Card className="border-emerald-900/20 hover:border-emerald-700/40 transition-all">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
            {doctor.imageUrl ? (
              <img
                src={doctor.imageUrl}
                alt={doctor.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-emerald-400" />
            )}
          </div>

          <Badge className="bg-emerald-900/20 border-emerald-900/30 text-emerald-400 flex items-center space-x-1">
            <Star className="h-3 w-3 mr-1" />
            <span>Verified</span>
          </Badge>
        </div>

        {/* Name and Specialty */}
        <div>
          <h3 className="text-lg font-semibold text-white">{doctor.name}</h3>
          <p className="text-sm text-muted-foreground">
            {doctor.specialty} • {doctor.experience} years experience
          </p>
        </div>

        {/* Description */}
        {doctor.description && (
          <p className="text-sm text-muted-foreground">{doctor.description}</p>
        )}

        {/* Button */}
        <div className="mt-4">
          <Button
            asChild
            variant="outline"
            className="w-full justify-center text-emerald-600 border-emerald-600"
          >
            <Link
              href={`/doctors/${doctor.specialty}/${doctor.id}`}
              className="flex items-center justify-center w-full"
            >
              <Calendar className="h-4 w-4 mr-2" />
              View Profile and Book
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
