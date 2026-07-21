"use client";

import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

import AdminLogin from "@components/admin/admin-login";
import AdminHeader from "@components/admin/admin-header";
import AdminStats from "@components/admin/admin-stats";
import AdminToolbar from "@components/admin/admin-toolbar";
import AdminProductTable, { AdminProduct } from "@components/admin/admin-product-table";
import ProductModal from "@components/admin/product-modal";
import CategoryManagerModal from "@components/admin/category-manager-modal";
import DeleteProductModal from "@components/admin/delete-product-modal";

export default function AdminPage() {
  // Auth state
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data states
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Database Categories & Subcategories
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string; display_order: number }[]>([]);
  const [dbSubCategories, setDbSubCategories] = useState<{ id: string; category_id: string; name: string; display_order: number }[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | "all">(50);

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [formError, setFormError] = useState("");

  const [isCatManagerOpen, setIsCatManagerOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

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

  const fetchCategoriesAndSubs = async () => {
    try {
      const resCat = await fetch("/api/admin/categories");
      const catData = await resCat.json();
      if (Array.isArray(catData)) setDbCategories(catData);

      const resSub = await fetch("/api/admin/sub-categories");
      const subData = await resSub.json();
      if (Array.isArray(subData)) setDbSubCategories(subData);
    } catch (err) {
      console.error("Failed fetching categories/subcategories:", err);
    }
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const { supabase } = await import("@lib/supabase/client");
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name), sub_categories(name)")
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }
      const formatted = (data || []).map((p: any) => ({
        ...p,
        main_category: p.categories?.name ?? p.main_category ?? "",
        sub_category: p.sub_categories?.name ?? p.sub_category ?? "",
      }));
      setProducts(formatted);
      await fetchCategoriesAndSubs();
    } catch (err: any) {
      console.error("Fetch products failed:", err);
      showToast("Could not sync with Supabase database.", "error");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleSaveProduct = async (formData: FormData) => {
    setIsSavingProduct(true);
    setFormError("");

    try {
      const url = "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

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
        setIsProductModalOpen(false);
        fetchProducts();
      } else {
        setFormError(result.error || "Failed to save product.");
      }
    } catch (err) {
      console.error(err);
      setFormError("A server communication error occurred.");
    } finally {
      setIsSavingProduct(false);
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
        fetchProducts();
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
    const nameStr = p.name || "";
    const mainCatStr = p.main_category || "";
    const subCatStr = p.sub_category || "";
    const tagStr = p.tag || "";
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      nameStr.toLowerCase().includes(q) ||
      mainCatStr.toLowerCase().includes(q) ||
      subCatStr.toLowerCase().includes(q) ||
      tagStr.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategoryFilter === "all" || mainCatStr === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const catOrderMap = new Map(dbCategories.map((c) => [c.name, c.display_order]));
  const subOrderMap = new Map(dbSubCategories.map((s) => [s.name, s.display_order]));

  const uniqueCategories = [...new Set(products.map((p) => p.main_category))]
    .filter(Boolean)
    .sort((a, b) => (catOrderMap.get(a) ?? 99) - (catOrderMap.get(b) ?? 99));

  const uniqueAdvtSpaces = [...new Set(products.map((p) => p.advt_space))].filter(Boolean);
  const uniqueSizes = [...new Set(products.map((p) => p.size))].filter(Boolean);
  const uniquePaperTypes = [...new Set(products.map((p) => p.paper_type))].filter(Boolean);

  const totalPages =
    itemsPerPage === "all"
      ? 1
      : Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  const paginatedProducts =
    itemsPerPage === "all"
      ? filteredProducts
      : filteredProducts.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

  const startItem =
    filteredProducts.length === 0
      ? 0
      : itemsPerPage === "all"
      ? 1
      : (currentPage - 1) * itemsPerPage + 1;

  const endItem =
    itemsPerPage === "all"
      ? filteredProducts.length
      : Math.min(currentPage * itemsPerPage, filteredProducts.length);

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">
            Verifying Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        password={password}
        setPassword={setPassword}
        authError={authError}
        isLoggingIn={isLoggingIn}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased pb-24">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl animate-in slide-in-from-bottom duration-300 ${
            toast.type === "success"
              ? "bg-white border-border text-slate-800"
              : "bg-red-50 border-red-200 text-red-800"
          } backdrop-blur-xl`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <AdminHeader
        onOpenCategoryManager={() => setIsCatManagerOpen(true)}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-7xl px-6 pt-8 space-y-8">
        {/* Stats */}
        <AdminStats
          totalProducts={products.length}
          totalCategories={dbCategories.length || uniqueCategories.length}
          totalTags={new Set(products.map((p) => p.tag).filter(Boolean)).size}
        />

        {/* Toolbar */}
        <AdminToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategoryFilter={selectedCategoryFilter}
          setSelectedCategoryFilter={setSelectedCategoryFilter}
          categories={uniqueCategories}
          onOpenAddModal={() => {
            setEditingProduct(null);
            setFormError("");
            setIsProductModalOpen(true);
          }}
        />

        {/* Products Table */}
        <AdminProductTable
          isLoading={isLoadingProducts}
          products={products}
          filteredCount={filteredProducts.length}
          paginatedProducts={paginatedProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          startItem={startItem}
          endItem={endItem}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(val) => {
            setItemsPerPage(val);
            setCurrentPage(1);
          }}
          onEditProduct={(product) => {
            setEditingProduct(product);
            setFormError("");
            setIsProductModalOpen(true);
          }}
          onDeleteProduct={setDeletingProduct}
        />
      </main>

      {/* Product Add/Edit Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        editingProduct={editingProduct}
        dbCategories={dbCategories}
        dbSubCategories={dbSubCategories}
        uniqueAdvtSpaces={uniqueAdvtSpaces}
        uniqueSizes={uniqueSizes}
        uniquePaperTypes={uniquePaperTypes}
        onOpenCategoryManager={() => setIsCatManagerOpen(true)}
        onSave={handleSaveProduct}
        formError={formError}
        setFormError={setFormError}
        isSaving={isSavingProduct}
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCatManagerOpen}
        onClose={() => setIsCatManagerOpen(false)}
        dbCategories={dbCategories}
        dbSubCategories={dbSubCategories}
        onRefreshData={fetchProducts}
        showToast={showToast}
      />

      {/* Delete Confirmation Modal */}
      <DeleteProductModal
        deletingProduct={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirmDelete={handleDeleteProduct}
        isDeleting={isDeleting}
      />
    </div>
  );
}
