"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  LogOut, 
  Lock, 
  FolderPlus, 
  Upload, 
  FileImage, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  Calendar,
  Grid,
  Tag,
  ChevronDown
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  main_category: string;
  sub_category: string;
  advt_space: string;
  size: string;
  paper_type: string;
  cover_image: string;
  full_image: string;
  tag: string;
  meta_title: string;
  meta_description: string;
}

interface SearchableDropdownProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
}

function SearchableDropdown({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="space-y-2 relative">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          required={required}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-[#F7FBF9] px-4 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 max-h-40 overflow-y-auto rounded-xl border border-border bg-white shadow-lg py-1 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-100">
          {filteredOptions.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className="px-4 py-2 text-sm text-slate-700 hover:bg-[#EAF5EF] hover:text-primary cursor-pointer transition-colors"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AdminPage() {
  // Auth state
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | "all">(50);

  // Form / Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Form inputs
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [advtSpace, setAdvtSpace] = useState("");
  const [size, setSize] = useState("");
  const [paperType, setPaperType] = useState("");
  const [tag, setTag] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // File states
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [fullImageFile, setFullImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [fullImagePreview, setFullImagePreview] = useState("");

  // Delete states
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast / Alert states
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch products once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  // Reset pagination on search query or category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategoryFilter, itemsPerPage]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/login");
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsLoggingIn(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setAuthError(data.error || "Login failed");
      }
    } catch {
      setAuthError("Failed to communicate with authentication server.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
      setIsAuthenticated(false);
      setProducts([]);
      showToast("Logged out successfully", "success");
    } catch {
      showToast("Logout failed", "error");
    }
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const { supabase } = await import("@lib/supabase/client");
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }
      setProducts(data || []);
    } catch (err: any) {
      console.error("Fetch products failed:", err);
      showToast("Could not sync with Supabase database.", "error");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setMainCategory("");
    setSubCategory("");
    setAdvtSpace("");
    setSize("");
    setPaperType("");
    setTag("Best seller");
    setMetaTitle("");
    setMetaDescription("");
    setCoverImageFile(null);
    setFullImageFile(null);
    setCoverImagePreview("");
    setFullImagePreview("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description || "");
    setMainCategory(product.main_category);
    setSubCategory(product.sub_category);
    setAdvtSpace(product.advt_space || "");
    setSize(product.size || "");
    setPaperType(product.paper_type || "");
    setTag(product.tag || "");
    setMetaTitle(product.meta_title || "");
    setMetaDescription(product.meta_description || "");
    setCoverImageFile(null);
    setFullImageFile(null);
    setCoverImagePreview(product.cover_image);
    setFullImagePreview(product.full_image);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "cover" | "full") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate is image
    if (!file.type.startsWith("image/")) {
      setFormError("Only image files are allowed.");
      return;
    }

    if (type === "cover") {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    } else {
      setFullImageFile(file);
      setFullImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mainCategory || !subCategory) {
      setFormError("Product Name, Category, and Sub-category are required fields.");
      return;
    }

    if (!editingProduct && (!coverImageFile || !fullImageFile)) {
      setFormError("Both Cover and Full images are required for new products.");
      return;
    }

    setIsSaving(true);
    setFormError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("main_category", mainCategory);
      formData.append("sub_category", subCategory);
      formData.append("advt_space", advtSpace);
      formData.append("size", size);
      formData.append("paper_type", paperType);
      formData.append("tag", tag);
      formData.append("meta_title", metaTitle);
      formData.append("meta_description", metaDescription);

      if (coverImageFile) {
        formData.append("cover_image_file", coverImageFile);
      }
      if (fullImageFile) {
        formData.append("full_image_file", fullImageFile);
      }

      let url = "/api/admin/products";
      let method = "POST";

      if (editingProduct) {
        method = "PUT";
        formData.append("id", editingProduct.id);
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        showToast(
          editingProduct
            ? "Product updated successfully"
            : "Product created successfully",
          "success"
        );
        setIsModalOpen(false);
        fetchProducts(); // Refresh list
      } else {
        setFormError(result.error || "Failed to save product.");
      }
    } catch (err) {
      console.error(err);
      setFormError("A server communication error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/products?id=${deletingProduct.id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (res.ok) {
        showToast("Product deleted successfully", "success");
        setDeletingProduct(null);
        fetchProducts(); // Refresh list
      } else {
        showToast(result.error || "Failed to delete product", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("A server error occurred during deletion", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.main_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategoryFilter === "all" || p.main_category === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [...new Set(products.map((p) => p.main_category))].filter(Boolean);
  const uniqueSubCategories = [...new Set(products.map((p) => p.sub_category))].filter(Boolean);
  const uniqueAdvtSpaces = [...new Set(products.map((p) => p.advt_space))].filter(Boolean);
  const uniqueSizes = [...new Set(products.map((p) => p.size))].filter(Boolean);
  const uniquePaperTypes = [...new Set(products.map((p) => p.paper_type))].filter(Boolean);

  const totalPages = itemsPerPage === "all" 
    ? 1 
    : Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  const paginatedProducts = itemsPerPage === "all"
    ? filteredProducts
    : filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const startItem = filteredProducts.length === 0 
    ? 0 
    : itemsPerPage === "all" 
      ? 1 
      : (currentPage - 1) * itemsPerPage + 1;

  const endItem = itemsPerPage === "all" 
    ? filteredProducts.length 
    : Math.min(currentPage * itemsPerPage, filteredProducts.length);

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  // Auth gate render
  if (!isAuthenticated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#F7FBF9] px-4 overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#2AA8BE]/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md rounded-2xl border border-border/60 bg-white p-8 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#1A1A1A] sm:text-3xl">
              Admin Portal
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your password to unlock catalog configurations
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Secret Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-border bg-[#F7FBF9] px-4 py-3.5 text-base text-slate-800 placeholder-slate-400 outline-none transition focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <p>{authError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="relative w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-primary-foreground transition hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Unlocking...</span>
                </>
              ) : (
                <span>Unlock Control Panel</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard render
  return (
    <div className="min-h-screen bg-background text-foreground antialiased pb-24">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl animate-in slide-in-from-bottom duration-300 ${
          toast.type === "success" 
            ? "bg-white border-border text-slate-800" 
            : "bg-red-50 border-red-200 text-red-800"
        } backdrop-blur-xl`}>
          {toast.type === "success" ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header Navigation */}
      <header className="border-b border-border/60 bg-white/80 sticky top-[64px] z-30 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
              CC
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-[#1A1A1A] leading-none">Catalog Admin</h1>
              <p className="text-xs text-muted-foreground mt-1">Calendar Catalog Control Panel</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-accent transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pt-8 space-y-8">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm flex items-center gap-5">
            <div className="p-4 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Products</p>
              <h2 className="text-3xl font-extrabold text-[#1A1A1A] mt-1">{products.length}</h2>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm flex items-center gap-5">
            <div className="p-4 rounded-xl bg-[#2AA8BE]/10 text-[#2AA8BE] border border-[#2AA8BE]/20">
              <Grid className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Unique Categories</p>
              <h2 className="text-3xl font-extrabold text-[#1A1A1A] mt-1">{uniqueCategories.length}</h2>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm flex items-center gap-5">
            <div className="p-4 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20">
              <Tag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Featured tags</p>
              <h2 className="text-3xl font-extrabold text-[#1A1A1A] mt-1">
                {products.filter(p => p.tag).length}
              </h2>
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-border/60 shadow-sm">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search calendars by name, category, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-[#F7FBF9] pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-primary/50"
              />
            </div>
            {/* Category Filter */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="rounded-xl border border-border bg-[#F7FBF9] px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary/50 min-w-[200px]"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 active:scale-[0.98] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Calendar</span>
          </button>
        </section>

        {/* Products Table */}
        <section className="rounded-2xl border border-border/60 bg-white shadow-sm overflow-hidden">
          {isLoadingProducts ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 bg-slate-50/50">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-slate-500 text-sm">Syncing with database...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-slate-50/50">
              <div className="h-12 w-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4 border border-border/50">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">No products found</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">
                Try adjusting your search queries or category filters, or add a brand new calendar template.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-[#F7FBF9]/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Category & Size</th>
                    <th className="px-6 py-4">Advt Space</th>
                    <th className="px-6 py-4">Paper & Tag</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-12 shrink-0 rounded-lg bg-[#F7FBF9] border border-border overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.cover_image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 block text-sm">{product.name}</span>
                            <span className="text-xs text-slate-500 block max-w-[200px] truncate mt-1">
                              {product.description || "No description"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-slate-700 block font-medium">{product.main_category}</span>
                        <span className="text-slate-500 block text-xs mt-1">
                          {product.size || product.sub_category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                        {product.advt_space || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-slate-600 block">{product.paper_type || "—"}</span>
                        {product.tag && (
                          <span className="inline-block rounded-md bg-[#EAF5EF] px-2 py-0.5 text-xs font-semibold text-[#2D6A47] mt-1.5 border border-[#D0EBD9]">
                            {product.tag}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-100 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProduct(product)}
                            className="p-2 rounded-xl text-slate-400 hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
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
              
              {/* Pagination Footer */}
              <div className="border-t border-border/60 bg-[#F7FBF9]/30 px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: Page Size Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      const val = e.target.value;
                      setItemsPerPage(val === "all" ? "all" : Number(val));
                      setCurrentPage(1);
                    }}
                    className="rounded-lg border border-border bg-[#F7FBF9] px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-primary/50"
                  >
                    <option value={50}>50 per page</option>
                    <option value="all">Show all</option>
                  </select>
                </div>

                {/* Center: Info text */}
                <span className="text-xs text-slate-500 font-medium">
                  Showing {startItem}–{endItem} of {filteredProducts.length} entries
                </span>

                {/* Right: Prev/Next Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || itemsPerPage === "all"}
                    className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-border bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
                  >
                    Previous
                  </button>
                  
                  <span className="text-xs text-slate-500 font-semibold px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || itemsPerPage === "all"}
                    className="inline-flex h-8 px-3 items-center justify-center rounded-lg border border-border bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isSaving && setIsModalOpen(false)} />
          
          <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-border/60 bg-white shadow-2xl max-h-[90vh] flex flex-col animate-in scale-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProduct ? `Edit Calendar: ${editingProduct.name}` : "Add New Calendar Template"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition disabled:opacity-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable Form) */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {formError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <p>{formError}</p>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Product Name / Model Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. 450, 51A"
                    className="w-full rounded-xl border border-border bg-[#F7FBF9] px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                {/* Tag */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="e.g. Best seller, New Arrival"
                    className="w-full rounded-xl border border-border bg-[#F7FBF9] px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                {/* Main Category */}
                <SearchableDropdown
                  label="Main Category *"
                  value={mainCategory}
                  onChange={setMainCategory}
                  options={uniqueCategories}
                  placeholder="e.g. Real Art Calendars, Crystal Calendars"
                  required
                />

                {/* Sub Category */}
                <SearchableDropdown
                  label="Sub-category Description *"
                  value={subCategory}
                  onChange={setSubCategory}
                  options={uniqueSubCategories}
                  placeholder="e.g. 14 x 20 4 Sheeter, 14 x 24"
                  required
                />

                {/* Advt Space */}
                <SearchableDropdown
                  label="Advertisement Space"
                  value={advtSpace}
                  onChange={setAdvtSpace}
                  options={uniqueAdvtSpaces}
                  placeholder="e.g. 4 x 13, 5.5 x 18"
                />

                {/* Size */}
                <SearchableDropdown
                  label="Dimensions / Size"
                  value={size}
                  onChange={setSize}
                  options={uniqueSizes}
                  placeholder="e.g. 14 x 20, 19 x 29"
                />

                {/* Paper Type */}
                <div className="md:col-span-2">
                  <SearchableDropdown
                    label="Paper Quality / Thickness"
                    value={paperType}
                    onChange={setPaperType}
                    options={uniquePaperTypes}
                    placeholder="e.g. 130 GSM Art Paper, Poly Board with Hanger"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Detailed Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional details about this design pattern..."
                    rows={3}
                    className="w-full rounded-xl border border-border bg-[#F7FBF9] px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none"
                  />
                </div>

                {/* Image Upload Grid */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  {/* Cover Image File */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Cover Thumbnail Image *
                    </label>
                    <div className="relative border border-dashed border-border rounded-xl bg-[#F7FBF9] p-4 hover:border-primary/50 hover:bg-[#EAF5EF]/20 transition flex flex-col items-center justify-center text-center group min-h-[140px]">
                      {coverImagePreview ? (
                        <div className="relative h-20 w-16 bg-slate-50 border border-border rounded overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={coverImagePreview} alt="Cover Preview" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => { setCoverImageFile(null); setCoverImagePreview(""); }}
                            className="absolute top-1 right-1 p-0.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-white cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-slate-400 group-hover:text-primary transition mb-2" />
                          <span className="text-xs text-slate-500 block font-medium">Drag & drop or Click</span>
                          <span className="text-[10px] text-slate-400 block mt-1">JPEG/PNG/WEBP files</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "cover")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Full Image File */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Full Resolution Image *
                    </label>
                    <div className="relative border border-dashed border-border rounded-xl bg-[#F7FBF9] p-4 hover:border-primary/50 hover:bg-[#EAF5EF]/20 transition flex flex-col items-center justify-center text-center group min-h-[140px]">
                      {fullImagePreview ? (
                        <div className="relative h-20 w-16 bg-slate-50 border border-border rounded overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={fullImagePreview} alt="Full Preview" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => { setFullImageFile(null); setFullImagePreview(""); }}
                            className="absolute top-1 right-1 p-0.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-white cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-slate-400 group-hover:text-primary transition mb-2" />
                          <span className="text-xs text-slate-500 block font-medium">Drag & drop or Click</span>
                          <span className="text-[10px] text-slate-400 block mt-1">JPEG/PNG/WEBP files</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "full")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* SEO Configurations */}
                <div className="md:col-span-2 border-t border-border/60 pt-5 mt-2 space-y-4">
                  <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-primary" />
                    <span>SEO Meta Settings (Optional)</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder="Page title for search engines"
                        className="w-full rounded-xl border border-border bg-[#F7FBF9] px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
                        Meta Description
                      </label>
                      <input
                        type="text"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="Page description snippet"
                        className="w-full rounded-xl border border-border bg-[#F7FBF9] px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-border/60">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-border bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save Template</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isDeleting && setDeletingProduct(null)} />
          
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl animate-in scale-in duration-200">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Delete Calendar Template?</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Are you sure you want to delete <span className="text-slate-800 font-semibold">{deletingProduct.name}</span>? 
                  This will permanently delete the database record and all associated images from Supabase storage. 
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingProduct(null)}
                className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteProduct}
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
      )}
    </div>
  );
}
