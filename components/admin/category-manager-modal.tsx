"use client";

import React, { useState } from "react";
import { FolderPlus, X, Edit3, Trash2, AlertTriangle } from "lucide-react";
import { formatSupabaseError } from "@lib/utils";

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  dbCategories: { id: string; name: string; display_order: number }[];
  dbSubCategories: {
    id: string;
    category_id: string;
    name: string;
    display_order: number;
  }[];
  onRefreshData: () => Promise<void>;
  showToast: (msg: string, type: "success" | "error") => void;
}

export default function CategoryManagerModal({
  isOpen,
  onClose,
  dbCategories,
  dbSubCategories,
  onRefreshData,
  showToast,
}: CategoryManagerModalProps) {
  const [catManagerTab, setCatManagerTab] = useState<"categories" | "subcategories">("categories");
  const [selectedCatId, setSelectedCatId] = useState<string>("");

  const [catNameInput, setCatNameInput] = useState("");
  const [catOrderInput, setCatOrderInput] = useState<number | "">(1);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const [subNameInput, setSubNameInput] = useState("");
  const [subOrderInput, setSubOrderInput] = useState<number | "">(1);
  const [editingSubId, setEditingSubId] = useState<string | null>(null);

  const [catActionLoading, setCatActionLoading] = useState(false);
  const [catManagerError, setCatManagerError] = useState("");

  if (!isOpen) return null;

  // Category CRUD
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameInput.trim()) return;
    setCatActionLoading(true);
    setCatManagerError("");

    try {
      const method = editingCatId ? "PUT" : "POST";
      const payload: any = {
        name: catNameInput.trim(),
        display_order: typeof catOrderInput === "number" ? catOrderInput : 1,
      };
      if (editingCatId) payload.id = editingCatId;

      const res = await fetch("/api/admin/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(
          editingCatId ? "Category updated" : "Category created",
          "success"
        );
        setCatNameInput("");
        setCatOrderInput(dbCategories.length + 2);
        setEditingCatId(null);
        setCatManagerError("");
        await onRefreshData();
      } else {
        const errorMsg = formatSupabaseError(data.error || "Failed to save category");
        setCatManagerError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch {
      setCatManagerError("Request failed");
      showToast("Request failed", "error");
    } finally {
      setCatActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this category and all its subcategories?"
      )
    )
      return;
    setCatActionLoading(true);
    setCatManagerError("");
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Category deleted", "success");
        if (selectedCatId === id) setSelectedCatId("");
        await onRefreshData();
      } else {
        const data = await res.json();
        const errorMsg = formatSupabaseError(data.error || "Delete failed");
        setCatManagerError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setCatActionLoading(false);
    }
  };

  // Subcategory CRUD
  const handleSaveSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatId || !subNameInput.trim()) return;
    setCatActionLoading(true);
    setCatManagerError("");

    try {
      const method = editingSubId ? "PUT" : "POST";
      const payload: any = {
        category_id: selectedCatId,
        name: subNameInput.trim(),
        display_order: typeof subOrderInput === "number" ? subOrderInput : 1,
      };
      if (editingSubId) payload.id = editingSubId;

      const res = await fetch("/api/admin/sub-categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(
          editingSubId ? "Subcategory updated" : "Subcategory created",
          "success"
        );
        setSubNameInput("");
        setEditingSubId(null);
        setCatManagerError("");
        await onRefreshData();
      } else {
        const errorMsg = formatSupabaseError(data.error || "Failed to save subcategory");
        setCatManagerError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch {
      setCatManagerError("Request failed");
      showToast("Request failed", "error");
    } finally {
      setCatActionLoading(false);
    }
  };

  const handleDeleteSubCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;
    setCatActionLoading(true);
    setCatManagerError("");
    try {
      const res = await fetch(`/api/admin/sub-categories?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Subcategory deleted", "success");
        await onRefreshData();
      } else {
        const data = await res.json();
        const errorMsg = formatSupabaseError(data.error || "Delete failed");
        setCatManagerError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setCatActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-border/60 bg-white shadow-2xl max-h-[85vh] flex flex-col animate-in scale-in duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <FolderPlus className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Manage Categories & Subcategories
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border/60 px-6 pt-2 bg-slate-50/50 gap-4">
          <button
            type="button"
            onClick={() => setCatManagerTab("categories")}
            className={`py-2.5 text-sm font-semibold border-b-2 transition cursor-pointer ${
              catManagerTab === "categories"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Main Categories ({dbCategories.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setCatManagerTab("subcategories");
              if (dbCategories.length > 0 && !selectedCatId) {
                setSelectedCatId(dbCategories[0].id);
              }
            }}
            className={`py-2.5 text-sm font-semibold border-b-2 transition cursor-pointer ${
              catManagerTab === "subcategories"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Subcategories ({dbSubCategories.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {catManagerError && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <p className="font-medium">{catManagerError}</p>
            </div>
          )}

          {catManagerTab === "categories" ? (
            <div className="space-y-6">
              {/* Form to Add/Edit Main Category */}
              <form
                onSubmit={handleSaveCategory}
                className="flex gap-3 items-end bg-[#F7FBF9] p-4 rounded-xl border border-border"
              >
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                    Category Name
                  </label>
                  <input
                    type="text"
                    required
                    value={catNameInput}
                    onChange={(e) => setCatNameInput(e.target.value)}
                    placeholder="e.g. Premium Planners"
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary"
                  />
                </div>
                <div className="w-28 space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                    Order #
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={catOrderInput}
                    onChange={(e) =>
                      setCatOrderInput(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={catActionLoading}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition cursor-pointer disabled:opacity-50"
                  >
                    {editingCatId ? "Update" : "Add"}
                  </button>
                  {editingCatId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCatId(null);
                        setCatNameInput("");
                      }}
                      className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* List of Categories */}
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                    <tr>
                      <th className="px-4 py-3 w-16">Order</th>
                      <th className="px-4 py-3">Category Name</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {dbCategories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-semibold text-primary">
                          {cat.display_order}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {cat.name}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCatId(cat.id);
                                setCatNameInput(cat.name);
                                setCatOrderInput(cat.display_order);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 transition"
                              title="Edit"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Category Selector for Subcategories */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Select Parent Main Category
                </label>
                <select
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-[#F7FBF9] px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-primary"
                >
                  {dbCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.display_order}. {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Form to Add/Edit Subcategory */}
              {selectedCatId && (
                <form
                  onSubmit={handleSaveSubCategory}
                  className="flex gap-3 items-end bg-[#F7FBF9] p-4 rounded-xl border border-border"
                >
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                      Subcategory Name / Size
                    </label>
                    <input
                      type="text"
                      required
                      value={subNameInput}
                      onChange={(e) => setSubNameInput(e.target.value)}
                      placeholder="e.g. 14 x 20 4 Sheeter"
                      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary"
                    />
                  </div>
                  <div className="w-28 space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                      Order #
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={subOrderInput}
                      onChange={(e) =>
                        setSubOrderInput(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={catActionLoading}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition cursor-pointer disabled:opacity-50"
                    >
                      {editingSubId ? "Update" : "Add"}
                    </button>
                    {editingSubId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSubId(null);
                          setSubNameInput("");
                        }}
                        className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* List of Subcategories under Selected Category */}
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                    <tr>
                      <th className="px-4 py-3 w-16">Order</th>
                      <th className="px-4 py-3">Subcategory Name</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {dbSubCategories
                      .filter((s) => s.category_id === selectedCatId)
                      .map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-semibold text-primary">
                            {sub.display_order}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {sub.name}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingSubId(sub.id);
                                  setSubNameInput(sub.name);
                                  setSubOrderInput(sub.display_order);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 transition"
                                title="Edit"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSubCategory(sub.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {dbSubCategories.filter(
                      (s) => s.category_id === selectedCatId
                    ).length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-6 text-center text-slate-400 text-sm"
                        >
                          No subcategories found for this main category.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
