import { supabaseServer } from "./supabase-server";
export async function uploadToSupabase(file: File, folder: string) {
    const safeFileName = file.name
      .normalize("NFKD")
      .replace(/[^\w.-]/g, "_");
  
    const filePath = `${folder}/${Date.now()}-${safeFileName}`;
    console.log("Uploading file as:", filePath);
  
    const { error } = await supabaseServer.storage
      .from("taskoria")
      .upload(filePath, file);
  
    if (error) throw error;
  
    const { data } = supabaseServer.storage.from("taskoria").getPublicUrl(filePath);
    
    console.log("Supabase public URL:", data.publicUrl);
  
    return encodeURI(data.publicUrl);
  }