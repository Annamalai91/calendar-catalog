const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Load .env.local variables manually
function loadEnv() {
  const envPath = path.join(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    console.log("Loading environment variables from .env.local...");
    const content = fs.readFileSync(envPath, "utf8");
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      const key = trimmed.substring(0, index).trim();
      let val = trimmed.substring(index + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  } else {
    console.warn("Warning: .env.local file not found.");
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env.local");
  process.exit(1);
}

// Initialize Supabase Client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

const BUCKET_NAME = "product-images";

async function uploadImage(localPath, relativeDestPath) {
  const absolutePath = path.join(__dirname, "../public", localPath);
  if (!fs.existsSync(absolutePath)) {
    console.warn(`File not found: ${absolutePath}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(absolutePath);
  // Get extension & mime type
  const ext = path.extname(localPath).toLowerCase();
  let contentType = "image/jpeg";
  if (ext === ".png") contentType = "image/png";
  if (ext === ".webp") contentType = "image/webp";

  console.log(`Uploading ${localPath} to storage bucket ${BUCKET_NAME}/${relativeDestPath}...`);

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(relativeDestPath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error(`Failed to upload ${localPath}:`, error.message);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(relativeDestPath);
  return urlData.publicUrl;
}

async function run() {
  console.log("Starting database and image migration to Supabase...");

  // Load local templates
  const templatePath = path.join(__dirname, "../configs/template.json");
  if (!fs.existsSync(templatePath)) {
    console.error(`Error: template.json not found at ${templatePath}`);
    process.exit(1);
  }

  const templates = JSON.parse(fs.readFileSync(templatePath, "utf8"));
  console.log(`Found ${templates.length} products to migrate.`);

  // Verify connection by checking the bucket
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.error("Error connecting to Supabase Storage:", bucketError.message);
    console.error("Please make sure your API credentials are correct and you are online.");
    process.exit(1);
  }

  const bucketExists = buckets.some((b) => b.name === BUCKET_NAME);
  if (!bucketExists) {
    console.error(`Error: Bucket '${BUCKET_NAME}' does not exist.`);
    console.error(`Please create a public bucket named '${BUCKET_NAME}' in your Supabase dashboard first.`);
    process.exit(1);
  }

  let successCount = 0;

  for (const item of templates) {
    console.log(`\nProcessing product: ${item.name}...`);

    let coverUrl = item.cover_image;
    let fullUrl = item.full_image;

    // Check and upload cover image
    if (item.cover_image && item.cover_image.startsWith("/assets/")) {
      const coverDest = `products/${path.basename(item.cover_image)}`;
      const uploadedUrl = await uploadImage(item.cover_image, coverDest);
      if (uploadedUrl) coverUrl = uploadedUrl;
    }

    // Check and upload full image
    if (item.full_image && item.full_image.startsWith("/assets/")) {
      const fullDest = `products/${path.basename(item.full_image)}`;
      const uploadedUrl = await uploadImage(item.full_image, fullDest);
      if (uploadedUrl) fullUrl = uploadedUrl;
    }

    // Prepare DB record
    const productRecord = {
      name: item.name,
      description: item.description || "",
      main_category: item.main_category,
      sub_category: item.sub_category,
      advt_space: item.advt_space || "",
      size: item.size || "",
      paper_type: item.paper_type || "",
      cover_image: coverUrl,
      full_image: fullUrl,
      tag: item.tag || "",
      meta_title: item.meta_title || "",
      meta_description: item.meta_description || "",
    };

    // Upsert into public.products table
    const { error: dbError } = await supabase
      .from("products")
      .upsert(productRecord, { onConflict: "name" });

    if (dbError) {
      console.error(`Failed to upsert product '${item.name}' into database:`, dbError.message);
    } else {
      console.log(`Successfully migrated product '${item.name}'`);
      successCount++;
    }
  }

  console.log(`\nMigration completed: ${successCount}/${templates.length} products migrated successfully.`);
}

run().catch((err) => {
  console.error("Unhandled error during migration:", err);
});
