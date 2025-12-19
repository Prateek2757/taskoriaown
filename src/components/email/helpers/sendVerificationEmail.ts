import { resend } from "@/lib/resend";
import WelcomeEmail from "../VerificationEmail";

export async function sendVerificationEmail(
    email ?: string,
    username? : string,
    verifyCode ?: string
) {
    try {

        if(!email){
            throw new Error("Email is requried")
        }
        await resend.emails.send({
          from : 'Taskoria <noreply@taskoria.com>' ,
          to : email,
          subject :  "Welcome Message" ,
          react : WelcomeEmail({username}),
          });
          return {SUCCESS : true , message : ' Welcome  Send Verification'}
    }
     
    

     catch (error) {
        console.log("Error Sending Verification Email",error);
        return { SUCCESS : false , message : 'Failed To send Verification email' }
        
    }
}