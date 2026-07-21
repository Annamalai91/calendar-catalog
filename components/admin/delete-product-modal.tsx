"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { AdminProduct } from "./admin-product-table";

interface DeleteProductModalProps {
  deletingProduct: AdminProduct | null;
  onClose: () => void;
  onConfirmDelete: () => Promise<void>;
  isDeleting: boolean;
}

export default function DeleteProductModal({
  deletingProduct,
  onClose,
  onConfirmDelete,
  isDeleting,
}: DeleteProductModalProps) {
  if (!deletingProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !isDeleting && onClose()}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl animate-in scale-in duration-200">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Delete Calendar Template?
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete{" "}
              <span className="text-slate-800 font-semibold">
                {deletingProduct.name}
              </span>
              ? This will permanently delete the database record and all
              associated images from Supabase storage. This action cannot be
              undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirmDelete}
            className="rounded-xl bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Template</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
