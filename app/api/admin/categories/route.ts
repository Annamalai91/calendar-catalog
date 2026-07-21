import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getSupabaseServer } from "@lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { formatSupabaseError } from "@lib/utils";

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

// GET - List all main categories
export async function GET() {
  try {
    const supabaseServer = getSupabaseServer();
    const { data, error } = await supabaseServer
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: formatSupabaseError(error) }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error("Fetch categories error:", error);
    return NextResponse.json(
      { error: formatSupabaseError(error) },
      { status: 500 }
    );
  }
}

// POST - Create a category
export async function POST(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, display_order } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const supabaseServer = getSupabaseServer();
    const { data, error } = await supabaseServer
      .from("categories")
      .insert([
        {
          name: name.trim(),
          display_order: typeof display_order === "number" ? display_order : 1,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: formatSupabaseError(error) }, { status: 400 });
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin");
    revalidateTag("categories", { expire: 0 });
    revalidateTag("products", { expire: 0 });

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: formatSupabaseError(error) },
      { status: 500 }
    );
  }
}

// PUT - Update a category
export async function PUT(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, display_order } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: "Category ID and name are required" },
        { status: 400 }
      );
    }

    const supabaseServer = getSupabaseServer();
    const { data, error } = await supabaseServer
      .from("categories")
      .update({
        name: name.trim(),
        display_order: typeof display_order === "number" ? display_order : 1,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: formatSupabaseError(error) }, { status: 400 });
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin");
    revalidateTag("categories", { expire: 0 });
    revalidateTag("products", { expire: 0 });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { error: formatSupabaseError(error) },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category (blocked if products are still assigned to it)
export async function DELETE(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing category ID" },
        { status: 400 }
      );
    }

    const supabaseServer = getSupabaseServer();

    // 1. Fetch category info
    const { data: category } = await supabaseServer
      .from("categories")
      .select("id, name")
      .eq("id", id)
      .single();

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // 2. Check if any products are using this category (by category_id or main_category name)
    let filterOr = `category_id.eq.${id}`;
    if (category.name) {
      filterOr += `,main_category.eq.${category.name}`;
    }

    const { count: productCount } = await supabaseServer
      .from("products")
      .select("id", { count: "exact" })
      .or(filterOr);

    if (productCount && productCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category "${category.name}". ${productCount} product(s) are currently assigned to this category. Please reassign or delete those products first.`,
        },
        { status: 400 }
      );
    }

    // 3. Delete any subcategories under this category
    await supabaseServer.from("sub_categories").delete().eq("category_id", id);

    // 4. Delete the category
    const { error } = await supabaseServer
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: formatSupabaseError(error) }, { status: 400 });
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin");
    revalidateTag("categories", { expire: 0 });
    revalidateTag("sub-categories", { expire: 0 });
    revalidateTag("products", { expire: 0 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: formatSupabaseError(error) },
      { status: 500 }
    );
  }
}
