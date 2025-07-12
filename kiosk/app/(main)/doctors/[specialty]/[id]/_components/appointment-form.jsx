"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Loader2, Clock, ArrowLeft, Calendar, CreditCard } from "lucide-react";
import { bookAppointment } from "@/actions/appointments";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { useRouter } from "next/navigation";


export function AppointmentForm({ doctorId, slot, onBack, onComplete }) {
  const [description, setDescription] = useState("");
  const router = useRouter();
  // Use the useFetch hook to handle loading, data, and error states
  const { loading, data, fn: submitBooking } = useFetch(bookAppointment);

  function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      reject(new Error("Something is not right"));
    };
    document.body.appendChild(script);
  });
}

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();


      try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        window.alert("Razorpay ask failed to load. Are you online?");
      }

     const response = await fetch("/api/create-order", { method: "POST" });
     const data = await response.json();

      if (!data || !data.id) {
        return window.alert("Order is not created");
      }
       const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Kiosk",
        description: "Appointment Booking",
        order_id: data.id,
        handler: async function (response) {
  try {
    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("startTime", slot.startTime);
    formData.append("endTime", slot.endTime);
    formData.append("description", description);

    await submitBooking(formData);
  } catch (error) {
    console.error("Booking failed after payment:", error);
    alert("Booking failed after payment. Please contact support.");
  }
},
      notes: {
        appointmentFor: doctorId,
        receipt: data.receipt,
      },
      theme: {
        color: "#10B981", // Emerald
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    rzp.on("payment.failed", function () {
      window.alert("Payment Failed");
    });
  } catch (e) {
    console.error(e);
  }
};
  // Handle response after booking attempt
  useEffect(() => {
    if (data) {
      if (data.success) {
        toast.success("Appointment booked successfully!");
        onComplete();
      }
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/20 p-4 rounded-lg border border-emerald-900/20 space-y-3">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-emerald-400 mr-2" />
          <span className="text-white font-medium">
            {format(new Date(slot.startTime), "EEEE, MMMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-emerald-400 mr-2" />
          <span className="text-white">{slot.formatted}</span>
        </div>
        <div className="flex items-center">
          <CreditCard className="h-5 w-5 text-emerald-400 mr-2" />
          <span className="text-muted-foreground">
            Cost: <span className="text-white font-medium">500 INR</span>
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Describe your medical concern (optional)
        </Label>
        <Textarea
          id="description"
          placeholder="Please provide any details about your medical concern or what you'd like to discuss in the appointment..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-background border-emerald-900/20 h-32"
        />
        <p className="text-sm text-muted-foreground">
          This information will be shared with the doctor before your
          appointment.
        </p>
      </div>

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="border-emerald-900/30"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Change Time Slot
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </div>
    </form>
  );
}