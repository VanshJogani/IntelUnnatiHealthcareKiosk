import { getDoctorsBySpecialty } from "@/actions/doctors-listing"
import PageHeader from "@/components/page-header"
import { redirect } from "next/navigation"
import  DoctorCard  from "@/components/doctor-card";
import React from "react"

const SpecialityPage = async ({ params }) => {
    const {specialty}= await params

    if (!specialty){
        redirect("/doctors")
    }

    const { doctors, error} = await getDoctorsBySpecialty(specialty)

    if(error){
        console.error("Error", error)
    }
    return (<div className="space-y-5">
        <PageHeader 
        title={specialty.split("%20").join(" ")}
        backLink="/doctors"
        backLabel="All Specialities" />
    {doctors && doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-white mb-2">
            No doctors available
          </h3>
          <p className="text-muted-foreground">
            There are currently no verified doctors in this specialty. Please
            check back later or choose another specialty.
          </p>
        </div>
      )}

    </div>)
}

export default SpecialityPage