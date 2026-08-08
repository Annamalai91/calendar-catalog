"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, AlertTriangle, Upload, Loader2, ChevronDown } from "lucide-react";
import { AdminProduct } from "./admin-product-table";

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
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="space-y-2 relative">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
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
          className="w-full rounded-xl border border-border dark:border-white/10 bg-[#F7FBF9] dark:bg-[#18181B] px-4 pr-10 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 max-h-40 overflow-y-auto rounded-xl border border-border dark:border-white/10 bg-white dark:bg-[#121215] shadow-lg py-1 divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in slide-in-from-top-1 duration-100">
          {filteredOptions.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className="px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-[#EAF5EF] dark:hover:bg-[#27272A] hover:text-primary dark:hover:text-primary cursor-pointer transition-colors"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: AdminProduct | null;
  dbCategories: { id: string; name: string; display_order: number }[];
  dbSubCategories: {
    id: string;
    category_id: string;
    name: string;
    display_order: number;
  }[];
  uniqueAdvtSpaces: string[];
  uniqueSizes: string[];
  uniquePaperTypes: string[];
  onOpenCategoryManager: () => void;
  onSave: (productData: FormData) => Promise<void>;
  formError: string;
  setFormError: (err: string) => void;
  formSuccess?: string;
  setFormSuccess?: (msg: string) => void;
  isSaving: boolean;
}

export default function ProductModal({
  isOpen,
  onClose,
  editingProduct,
  dbCategories,
  dbSubCategories,
  uniqueAdvtSpaces,
  uniqueSizes,
  uniquePaperTypes,
  onOpenCategoryManager,
  onSave,
  formError,
  setFormError,
  formSuccess,
  setFormSuccess,
  isSaving,
}: ProductModalProps) {
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

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [fullImageFile, setFullImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [fullImagePreview, setFullImagePreview] = useState("");

  const formTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formError || formSuccess) {
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [formError, formSuccess]);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description || "");
      setMainCategory(editingProduct.main_category);
      setSubCategory(editingProduct.sub_category);
      setAdvtSpace(editingProduct.advt_space || "");
      setSize(editingProduct.size || "");
      setPaperType(editingProduct.paper_type || "");
      setTag(editingProduct.tag || "");
      setMetaTitle(editingProduct.meta_title || "");
      setMetaDescription(editingProduct.meta_description || "");
      setCoverImageFile(null);
      setFullImageFile(null);
      setCoverImagePreview(editingProduct.cover_image);
      setFullImagePreview(editingProduct.full_image);
    } else {
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
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cover" | "full"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "cover") {
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    } else {
      setFullImageFile(file);
      setFullImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mainCategory || !subCategory) {
      setFormError("Product Name, Category, and Sub-category are required fields.");
      return;
    }

    if (!editingProduct && (!coverImageFile || !fullImageFile)) {
      setFormError("Both Cover and Full images are required for new products.");
      return;
    }

    const matchedCat = dbCategories.find((c) => c.name === mainCategory);
    const matchedSub = dbSubCategories.find((s) => s.name === subCategory);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("main_category", mainCategory);
    formData.append("sub_category", subCategory);
    if (matchedCat?.id) formData.append("category_id", matchedCat.id);
    if (matchedSub?.id) formData.append("sub_category_id", matchedSub.id);
    formData.append("advt_space", advtSpace);
    formData.append("size", size);
    formData.append("paper_type", paperType);
    formData.append("tag", tag);
    formData.append("meta_title", metaTitle);
    formData.append("meta_description", metaDescription);

    if (coverImageFile) formData.append("cover_image_file", coverImageFile);
    if (fullImageFile) formData.append("full_image_file", fullImageFile);
    if (editingProduct) formData.append("id", editingProduct.id);

    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !isSaving && onClose()}
      />

      <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-border/60 dark:border-white/10 bg-white dark:bg-[#121215] shadow-2xl max-h-[90vh] flex flex-col animate-in scale-in duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border/60 dark:border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {editingProduct
              ? `Edit Calendar: ${editingProduct.name}`
              : "Add New Calendar Template"}
          </h3>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable Form) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div ref={formTopRef} />
          {formError && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/60 p-4 text-sm text-red-600 dark:text-red-300 border border-red-100 dark:border-red-900/50">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <p>{formError}</p>
            </div>
          )}

          {formSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-green-50 dark:bg-green-950/60 p-4 text-sm text-green-700 dark:text-green-300 border border-green-200 dark:border-green-900/50">
              <div className="h-4 w-4 shrink-0 rounded-full bg-green-500 text-white flex items-center justify-center">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p>{formSuccess}</p>
            </div>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Product Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Product Name / Model Number *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 450, 51A"
                className="w-full rounded-xl border border-border dark:border-white/10 bg-[#F7FBF9] dark:bg-[#18181B] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Tag */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Badge / Tag
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. Best seller, New Arrival"
                className="w-full rounded-xl border border-border dark:border-white/10 bg-[#F7FBF9] dark:bg-[#18181B] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Main Category (Strict Select) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Main Category *
                </label>
                <button
                  type="button"
                  onClick={onOpenCategoryManager}
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1 cursor-pointer"
                >
                  + Manage Categories
                </button>
              </div>
              <select
                required
                value={mainCategory}
                onChange={(e) => {
                  const newCat = e.target.value;
                  setMainCategory(newCat);
                  setSubCategory("");
                }}
                className="w-full rounded-xl border border-border dark:border-white/10 bg-[#F7FBF9] dark:bg-[#18181B] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              >
                <option value="">-- Select Main Category --</option>
                {dbCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Category (Strict Select filtered by selected Main Category) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Sub-category Description *
              </label>
              <select
                required
                disabled={!mainCategory}
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full rounded-xl border border-border dark:border-white/10 bg-[#F7FBF9] dark:bg-[#18181B] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 disabled:opacity-50"
              >
                <option value="">
                  {!mainCategory
                    ? "-- Select Main Category First --"
                    : "-- Select Sub-category --"}
                </option>
                {(() => {
                  const matchedCat = dbCategories.find(
                    (c) => c.name === mainCategory
                  );
                  const availableSubs = matchedCat
                    ? dbSubCategories.filter(
                        (s) => s.category_id === matchedCat.id
                      )
                    : dbSubCategories;
                  return availableSubs.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ));
                })()}
              </select>
            </div>

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
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Detailed Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional details about this design pattern..."
                rows={3}
                className="w-full rounded-xl border border-border dark:border-white/10 bg-[#F7FBF9] dark:bg-[#18181B] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none"
              />
            </div>

            {/* Image Upload Grid */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Cover Image File */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Cover Thumbnail Image *
                </label>
                <div className="relative border border-dashed border-border dark:border-white/20 rounded-xl bg-[#F7FBF9] dark:bg-[#18181B] p-4 hover:border-primary/50 hover:bg-[#EAF5EF]/20 dark:hover:bg-[#27272A]/80 transition flex flex-col items-center justify-center text-center group min-h-[140px]">
                  {coverImagePreview ? (
                    <div className="relative h-20 w-16 bg-slate-50 dark:bg-slate-900 border border-border dark:border-white/10 rounded overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverImagePreview}
                        alt="Cover Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImageFile(null);
                          setCoverImagePreview("");
                        }}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-white cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-slate-400 dark:text-slate-500 group-hover:text-primary transition mb-2" />
                      <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                        Drag & drop or Click
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
                        JPEG/PNG/WEBP files
                      </span>
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
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Full Resolution Image *
                </label>
                <div className="relative border border-dashed border-border dark:border-white/20 rounded-xl bg-[#F7FBF9] dark:bg-[#18181B] p-4 hover:border-primary/50 hover:bg-[#EAF5EF]/20 dark:hover:bg-[#27272A]/80 transition flex flex-col items-center justify-center text-center group min-h-[140px]">
                  {fullImagePreview ? (
                    <div className="relative h-20 w-16 bg-slate-50 dark:bg-slate-900 border border-border dark:border-white/10 rounded overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fullImagePreview}
                        alt="Full Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFullImageFile(null);
                          setFullImagePreview("");
                        }}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-white cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-slate-400 dark:text-slate-500 group-hover:text-primary transition mb-2" />
                      <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                        Drag & drop or Click
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
                        JPEG/PNG/WEBP files
                      </span>
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

            {/* SEO Section */}
            <div className="md:col-span-2 border-t border-border/60 dark:border-white/10 pt-4 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                SEO & Metadata Configuration (Optional)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Page title for search engines"
                    className="w-full rounded-xl border border-border dark:border-white/10 bg-[#F7FBF9] dark:bg-[#18181B] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Meta Description
                  </label>
                  <input
                    type="text"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Page description snippet"
                    className="w-full rounded-xl border border-border dark:border-white/10 bg-[#F7FBF9] dark:bg-[#18181B] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-border/60 dark:border-white/10">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition disabled:opacity-50 cursor-pointer"
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
  );
}
