import {Resend} from "resend"


const pratik = process.env.NEXT_PUBLIC_RESEND_API_KEY


// if (!process.env.RESEND_API_KEY) {
//     throw new Error("RESEND_API_KEY is missing")
//   }

 export const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);