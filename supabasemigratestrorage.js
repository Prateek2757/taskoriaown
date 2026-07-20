import { createClient } from "@supabase/supabase-js";

const SOURCE_URL = "https://eoicjmcyigolwgjantsl.supabase.co";
const SOURCE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvaWNqbWN5aWdvbHdnamFudHNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQyMzYyNSwiZXhwIjoyMDc1OTk5NjI1fQ.NXYzpqucpknZvaFC2pZtPyZ4mEPNzNHpWLGTNuq0wTA";

const TARGET_URL = "https://mppgogqzisbmlffdhyrj.supabase.co";
const TARGET_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wcGdvZ3F6aXNibWxmZmRoeXJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDUzODE1MSwiZXhwIjoyMTAwMTE0MTUxfQ.KIeBTP6VGL8iWH1r-vGVqCGd1i9NsfllZz83A851sV8";

const BUCKET = "taskoria";

const source = createClient(SOURCE_URL, SOURCE_KEY);
const target = createClient(TARGET_URL, TARGET_KEY);


async function migrateFolder(path = "") {

  const { data: files, error } = await source
    .storage
    .from(BUCKET)
    .list(path, {
      limit: 1000
    });

  if (error) {
    console.log(error);
    return;
  }


  for (const file of files) {

    const filePath = path 
      ? `${path}/${file.name}`
      : file.name;


    if (file.id === null) {
      // folder
      await migrateFolder(filePath);
      continue;
    }


    console.log("Copying:", filePath);


    const { data: blob } = await source
      .storage
      .from(BUCKET)
      .download(filePath);


    await target
      .storage
      .from(BUCKET)
      .upload(
        filePath,
        blob,
        {
          upsert: true
        }
      );
  }
}


migrateFolder();