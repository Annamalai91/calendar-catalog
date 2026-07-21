import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getSupabaseServer } from "@lib/supabase/server";
import { revalidatePath } from "next/cache";
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

// GET - List all sub-categories
export async function GET() {
  try {
    const supabaseServer = getSupabaseServer();
    const { data, error } = await supabaseServer
      .from("sub_categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: formatSupabaseError(error) }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error("Fetch sub-categories error:", error);
    return NextResponse.json(
      { error: formatSupabaseError(error) },
      { status: 500 }
    );
  }
}

// POST - Create a sub-category
export async function POST(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { category_id, name, display_order } = body;

    if (!category_id || !name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Category ID and subcategory name are required" },
        { status: 400 }
      );
    }

    const supabaseServer = getSupabaseServer();
    const { data, error } = await supabaseServer
      .from("sub_categories")
      .insert([
        {
          category_id,
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

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Create sub-category error:", error);
    return NextResponse.json(
      { error: formatSupabaseError(error) },
      { status: 500 }
    );
  }
}

// PUT - Update a sub-category
export async function PUT(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, category_id, name, display_order } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: "Subcategory ID and name are required" },
        { status: 400 }
      );
    }

    const supabaseServer = getSupabaseServer();
    const updateData: Record<string, any> = {
      name: name.trim(),
      display_order: typeof display_order === "number" ? display_order : 1,
    };
    if (category_id) {
      updateData.category_id = category_id;
    }

    const { data, error } = await supabaseServer
      .from("sub_categories")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: formatSupabaseError(error) }, { status: 400 });
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin");

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Update sub-category error:", error);
    return NextResponse.json(
      { error: formatSupabaseError(error) },
      { status: 500 }
    );
  }
}

// DELETE - Delete a sub-category
export async function DELETE(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing subcategory ID" },
        { status: 400 }
      );
    }

    const supabaseServer = getSupabaseServer();
    const { error } = await supabaseServer
      .from("sub_categories")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: formatSupabaseError(error) }, { status: 400 });
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete sub-category error:", error);
    return NextResponse.json(
      { error: formatSupabaseError(error) },
      { status: 500 }
    );
  }
}
