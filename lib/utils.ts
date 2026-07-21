import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export function formatSupabaseError(error: any): string {
  if (!error) return "An unexpected error occurred.";

  const msg = typeof error === "string" ? error : error?.message || "";
  const code = error?.code || "";
  const details = error?.details || "";

  // Helper to extract field and value from Postgrest error details e.g. "Key (display_order)=(1) already exists."
  const extractKeyVal = (str: string) => {
    const match = str.match(/Key \((.*?)\)=\((.*?)\)/);
    return match ? { field: match[1], value: match[2] } : null;
  };

  const keyInfo = extractKeyVal(details || msg);

  // Check unique constraint violations (Postgres code 23505)
  if (
    code === "23505" ||
    msg.includes("duplicate key value violates unique constraint") ||
    msg.includes("already exists")
  ) {
    if (
      msg.includes("categories_display_order_key") ||
      (msg.includes("categories") && msg.includes("display_order"))
    ) {
      if (keyInfo?.value) {
        return `Order number ${keyInfo.value} is already used by another category. Please choose a different order number.`;
      }
      return "A category with this order number already exists. Please choose a unique order number.";
    }

    if (msg.includes("sub_categories") && msg.includes("display_order")) {
      if (keyInfo?.value) {
        const orderVal = keyInfo.value.split(",").pop()?.trim() || keyInfo.value;
        return `Order number ${orderVal} is already used by another subcategory in this category. Please choose a different order number.`;
      }
      return "A subcategory with this order number already exists under this category. Please choose a unique order number.";
    }

    if (msg.includes("display_order")) {
      return `Order number ${keyInfo?.value ? keyInfo.value + " " : ""}is already in use. Please choose a different order number.`;
    }

    if (msg.includes("categories_name_key")) {
      return `A category named "${keyInfo?.value || "this"}" already exists.`;
    }

    if (msg.includes("sub_categories_name_key")) {
      return `A subcategory named "${keyInfo?.value || "this"}" already exists under this category.`;
    }

    if (keyInfo) {
      return `The ${keyInfo.field.replace("_", " ")} "${keyInfo.value}" already exists. Please use a unique value.`;
    }

    return "A record with these details already exists. Please enter unique values.";
  }

  // Foreign key violation (Postgres code 23503)
  if (code === "23503" || msg.includes("violates foreign key constraint")) {
    return "Cannot perform this action because this item is referenced by other records.";
  }

  return msg || "An error occurred while processing your request.";
}

