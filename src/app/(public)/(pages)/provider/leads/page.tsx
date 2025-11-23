
"use client"
import LeadsPage from "@/components/showinglead/Leadpage"


function page() {
  return (
    <div><LeadsPage></LeadsPage></div>
  )
}

export default page;
// "use client";

// import { uploadToSupabase } from "@/lib/uploadFileToSupabase";
// import { useState } from "react";

// export default function TestUpload() {
//   const [file, setFile] = useState<File | null>(null);

//   async function handleUpload() {
//     if (!file) return alert("Select a file first!");

//     try {
//       const url = await uploadToSupabase(file, "profilepicture");
//       console.log("Uploaded URL:", url);
//       alert("Uploaded!\n" + url);
//     } catch (err: any) {
//       console.error(err);
//       alert("Upload failed: " + err.message);
//     }
//   }

//   return (
//     <div className="p-10">
//       <input
//         type="file"
//         onChange={(e) => setFile(e.target.files?.[0] ?? null)}
//         className="mb-3"
//       />

//       <button
//         onClick={handleUpload}
//         className="bg-blue-500 text-white p-2 rounded"
//       >
//         Upload
//       </button>
//     </div>
//   );
// }