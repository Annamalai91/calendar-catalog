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

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { error: formatSupabaseError(error) },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: formatSupabaseError(error) },
      { status: 500 }
    );
  }
}
