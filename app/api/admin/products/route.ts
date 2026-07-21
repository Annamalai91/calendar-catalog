import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getSupabaseServer } from "@lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

async function isAuthorized() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const expectedToken = crypto
    .createHash("sha256")
    .update(adminPassword)
    .digest("hex");

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  return sessionToken === expectedToken;
}

function getFileExtension(filename: string) {
  return filename.split(".").pop() || "jpg";
}

async function uploadImage(supabaseServer: any, file: File, productName: string, type: "cover" | "full") {
  const ext = getFileExtension(file.name);
  const sanitizedName = productName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  const destPath = `products/${sanitizedName}-${type}-${Date.now()}.${ext}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseServer.storage
    .from("product-images")
    .upload(destPath, fileBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload ${type} image: ${error.message}`);
  }

  const { data } = supabaseServer.storage.from("product-images").getPublicUrl(destPath);
  return data.publicUrl;
}

async function deleteStorageFile(supabaseServer: any, url: string) {
  if (!url || !url.includes("/product-images/")) return;
  const filePath = url.split("/product-images/")[1];
  if (filePath) {
    await supabaseServer.storage.from("product-images").remove([filePath]);
  }
}

// POST - Create a new product
export async function POST(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string || "";
    const main_category = formData.get("main_category") as string;
    const sub_category = formData.get("sub_category") as string;
    const advt_space = formData.get("advt_space") as string || "";
    const size = formData.get("size") as string || "";
    const paper_type = formData.get("paper_type") as string || "";
    const tag = formData.get("tag") as string || "";
    const meta_title = formData.get("meta_title") as string || "";
    const meta_description = formData.get("meta_description") as string || "";

    const coverFile = formData.get("cover_image_file") as File | null;
    const fullFile = formData.get("full_image_file") as File | null;

    const category_id = formData.get("category_id") as string || null;
    const sub_category_id = formData.get("sub_category_id") as string || null;

    if (!name || (!main_category && !category_id) || (!sub_category && !sub_category_id)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!coverFile || !fullFile) {
      return NextResponse.json({ error: "Cover and full images are required for new products" }, { status: 400 });
    }

    const supabaseServer = getSupabaseServer();

    // Check if product with name already exists
    const { data: existing } = await supabaseServer
      .from("products")
      .select("id")
      .eq("name", name)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: `Product with name "${name}" already exists.` }, { status: 400 });
    }

    // Upload images
    const coverUrl = await uploadImage(supabaseServer, coverFile, name, "cover");
    const fullUrl = await uploadImage(supabaseServer, fullFile, name, "full");

    const recordToInsert: any = {
      name,
      description,
      advt_space,
      size,
      paper_type,
      cover_image: coverUrl,
      full_image: fullUrl,
      tag,
      meta_title,
      meta_description,
    };
    if (category_id) recordToInsert.category_id = category_id;
    if (sub_category_id) recordToInsert.sub_category_id = sub_category_id;


    // Insert record
    const { error: dbError } = await supabaseServer
      .from("products")
      .insert(recordToInsert);

    if (dbError) {
      // Cleanup uploaded files on DB insert failure
      await deleteStorageFile(supabaseServer, coverUrl);
      await deleteStorageFile(supabaseServer, fullUrl);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }


    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/products");
    revalidateTag("products");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: error.message || "An error occurred." }, { status: 500 });
  }
}

// PUT - Update an existing product
export async function PUT(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string || "";
    const main_category = formData.get("main_category") as string;
    const sub_category = formData.get("sub_category") as string;
    const advt_space = formData.get("advt_space") as string || "";
    const size = formData.get("size") as string || "";
    const paper_type = formData.get("paper_type") as string || "";
    const tag = formData.get("tag") as string || "";
    const meta_title = formData.get("meta_title") as string || "";
    const meta_description = formData.get("meta_description") as string || "";

    const coverFile = formData.get("cover_image_file") as File | null;
    const fullFile = formData.get("full_image_file") as File | null;

    const category_id = formData.get("category_id") as string || null;
    const sub_category_id = formData.get("sub_category_id") as string || null;

    if (!id || !name || (!main_category && !category_id) || (!sub_category && !sub_category_id)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabaseServer = getSupabaseServer();

    // Get existing product to retrieve current image paths
    const { data: existing, error: fetchError } = await supabaseServer
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let coverUrl = existing.cover_image;
    let fullUrl = existing.full_image;
    let oldCoverToDelete = null;
    let oldFullToDelete = null;

    // Handle cover image update
    if (coverFile) {
      oldCoverToDelete = existing.cover_image;
      coverUrl = await uploadImage(supabaseServer, coverFile, name, "cover");
    }

    // Handle full image update
    if (fullFile) {
      oldFullToDelete = existing.full_image;
      fullUrl = await uploadImage(supabaseServer, fullFile, name, "full");
    }

    const recordToUpdate: any = {
      name,
      description,
      advt_space,
      size,
      paper_type,
      cover_image: coverUrl,
      full_image: fullUrl,
      tag,
      meta_title,
      meta_description,
    };
    if (category_id) recordToUpdate.category_id = category_id;
    if (sub_category_id) recordToUpdate.sub_category_id = sub_category_id;


    // Update DB
    const { error: dbError } = await supabaseServer
      .from("products")
      .update(recordToUpdate)
      .eq("id", id);


    if (dbError) {
      // Cleanup newly uploaded images if DB update fails
      if (coverFile) await deleteStorageFile(supabaseServer, coverUrl);
      if (fullFile) await deleteStorageFile(supabaseServer, fullUrl);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // DB update succeeded, delete old files from storage
    if (oldCoverToDelete) await deleteStorageFile(supabaseServer, oldCoverToDelete);
    if (oldFullToDelete) await deleteStorageFile(supabaseServer, oldFullToDelete);

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${existing.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}`);
    revalidatePath(`/products/${name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}`);
    revalidateTag("products");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: error.message || "An error occurred." }, { status: 500 });
  }
}

// DELETE - Delete a product
export async function DELETE(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    const supabaseServer = getSupabaseServer();

    // Get product to retrieve image paths
    const { data: existing, error: fetchError } = await supabaseServer
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete database record
    const { error: dbError } = await supabaseServer
      .from("products")
      .delete()
      .eq("id", id);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Delete storage files
    await deleteStorageFile(supabaseServer, existing.cover_image);
    await deleteStorageFile(supabaseServer, existing.full_image);

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${existing.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-")}`);
    revalidateTag("products");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: error.message || "An error occurred." }, { status: 500 });
  }
}
