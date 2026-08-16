const { createClient } = require("@supabase/supabase-js");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const idx = line.indexOf("=");
      if (idx !== -1) {
        const k = line.slice(0, idx).trim();
        let v = line.slice(idx + 1).trim();
        if ((v.startsWith("\"") && v.endsWith("\"")) || (v.startsWith("\x27") && v.endsWith("\x27"))) v = v.slice(1, -1);
        process.env[k] = v;
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function run() {
  console.log("Fetching products from Supabase...");
  const { data: products, error } = await supabase.from("products").select("id, name, cover_image, full_image");

  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }

  console.log(`Found ${products.length} products to check.`);
  let swappedCount = 0;

  for (const product of products) {
    if (!product.cover_image || !product.full_image || product.cover_image === product.full_image) {
      continue;
    }

    try {
      const coverRes = await fetch(product.cover_image);
      const coverBuf = Buffer.from(await coverRes.arrayBuffer());
      const coverMeta = await sharp(coverBuf).metadata();

      const fullRes = await fetch(product.full_image);
      const fullBuf = Buffer.from(await fullRes.arrayBuffer());
      const fullMeta = await sharp(fullBuf).metadata();

      const coverArea = (coverMeta.width || 0) * (coverMeta.height || 0);
      const fullArea = (fullMeta.width || 0) * (fullMeta.height || 0);

      // If cover_image is larger in resolution/bytes or wider than full_image, they are inverted
      if (coverBuf.length > fullBuf.length || coverArea > fullArea) {
        console.log(`\nSwapping images for product: ${product.name} (ID: ${product.id})`);
        console.log(`  Current cover: ${coverMeta.width}x${coverMeta.height} (${coverBuf.length}b) -> ${product.cover_image}`);
        console.log(`  Current full : ${fullMeta.width}x${fullMeta.height} (${fullBuf.length}b) -> ${product.full_image}`);

        const { error: updateError } = await supabase
          .from("products")
          .update({
            cover_image: product.full_image,
            full_image: product.cover_image,
          })
          .eq("id", product.id);

        if (updateError) {
          console.error(`  Failed to update ${product.name}:`, updateError.message);
        } else {
          console.log(`  Successfully swapped! New cover is ${fullMeta.width}x${fullMeta.height}, full is ${coverMeta.width}x${coverMeta.height}`);
          swappedCount++;
        }
      }
    } catch (err) {
      console.error(`Error processing ${product.name}:`, err.message);
    }
  }

  console.log(`\nCompleted! Successfully swapped ${swappedCount} products.`);
}

run();
