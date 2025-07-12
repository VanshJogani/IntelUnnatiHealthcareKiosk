import {  NextResponse } from "next/server";
import Razorpay from "razorpay";
import short from "shortid";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_KEY_ID,
  key_secret: process.env.RAZORPAY_TEST_SECRET_KEY,
});
export async function POST(req){
    try{
      const receipt = short.generate()

      const options ={
        amount: 500*100,
        currency: "INR",
        receipt: receipt,
      }
      const data = await razorpay.orders.create(options);

     return NextResponse.json(data, { status: 201 }); // ✅ FIXED
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}


