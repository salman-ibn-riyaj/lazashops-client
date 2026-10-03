"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import Lenis from "lenis";
import { postData, updateData } from "@/lib/admin-actions";
import { uploadToImgbb } from "@/lib/actions/action";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const CURRENCY = "৳";
const MAX_IMAGE_MB = 5;

const CATEGORIES = {
  punjabi: { key: "punjabi", label: "Punjabi", category: "Punjabi", tag: "punjabi", sizes: ["S", "M", "L", "XL"] },
  topCrop: { key: "topCrop", label: "Top Crop", category: "Top Crop", tag: "topcrop", sizes: ["XS", "S", "M", "L"] },
};

let rowCounter = 0;
const nextId = () => ++rowCounter;

const presetSizes = (key) =>
  CATEGORIES[key].sizes.map((size) => ({ id: nextId(), size, length: "", width: "" }));

const inches = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? String(n) : "";
};

const buildInitial = (product) => {
  if (!product) {
    return {
      categoryKey: "punjabi",
      values: {
        title: "",
        price: "",
        discount: "0",
        stock: "",
        color: "",
        fabric: "",
        gsm: "",
        description: "",
        care: "Machine wash cold, tumble dry low",
      },
      sizes: presetSizes("punjabi"),
      tags: ["punjabi"],
      imageUrl: "",
    };
  }

  const categoryKey = product.category === "Top Crop" ? "topCrop" : "punjabi";

  return {
    categoryKey,
    values: {
      title: product.title ?? "",
      price: String(product.price ?? ""),
      discount: String(product.discount ?? 0),
      stock: String(product.stock ?? ""),
      color: product.color ?? "",
      fabric: product.fabric ?? "",
      gsm: String(product.gsm ?? ""),
      description: product.description ?? "",
      care: product.care ?? "",
    },
    sizes: (product.sizes ?? []).map((s) => ({
      id: nextId(),
      size: s.size,
      length: inches(s.length),
      width: inches(s.width),
    })),
    tags: product.tags ?? [],
    imageUrl: product.imageUrl ?? "",
  };
};

const money = (n) =>
  `${CURRENCY}${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                      */
/* -------------------------------------------------------------------------- */
const baseInput =
  "h-11 w-full rounded-lg border bg-white px-3.5 text-[15px] text-[#19224A] placeholder:text-[#9AA3B8] outline-none transition focus:ring-4 focus:ring-[#19224A]/10";

function Input({ id, invalid, suffix, className = "", ...props }) {
  return (
    <div className="relative">
      <input
        id={id}
        aria-invalid={invalid ? "true" : undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={`${baseInput} ${
          invalid ? "border-[#C2412D]" : "border-[#DDE1EA] focus:border-[#19224A]"
        } ${suffix ? "pr-12" : ""} ${className}`}
        {...props}
      />
      {suffix && (
        <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-[#66708A]">
          {suffix}
        </span>
      )}
    </div>
  );
}

function Field({ id, label, error, hint, children, className = "" }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#19224A]">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-[#C2412D]">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-[#66708A]">{hint}</p>
      ) : null}
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <fieldset data-section className="border-t border-[#DDE1EA] py-8 first:border-t-0 first:pt-0">
      <legend className="sr-only">{title}</legend>
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-sm text-[#66708A]">{description}</p>}
      </div>
      {children}
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */
/*  Live preview: styled as a garment hang tag                                 */
/* -------------------------------------------------------------------------- */
function HangTag({ values, sizes, tags, preview, categoryKey, progress }) {
  const price = Number(values.price) || 0;
  const discount = Math.min(Math.max(Number(values.discount) || 0, 0), 100);
  const finalPrice = price * (1 - discount / 100);
  const filledSizes = sizes.filter((s) => s.size.trim());

  return (
    <aside data-preview className="lg:sticky lg:top-6">
      <div className="relative mx-auto mt-8 max-w-sm rounded-2xl border border-[#DDE1EA] bg-white px-5 pb-5 pt-10">
        <span className="absolute -top-8 left-1/2 h-12 w-px bg-[#C2412D]" aria-hidden="true" />
        <span
          className="absolute left-1/2 top-3.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-[#DDE1EA] bg-[#F1F3F7]"
          aria-hidden="true"
        />

        <div className="aspect-square overflow-hidden rounded-xl bg-[#E8EBF2]">
          <AnimatePresence mode="wait">
            {preview ? (
              <motion.img
                key={preview}
                src={preview}
                alt="Product preview"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full object-cover"
              />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full items-center justify-center px-8 text-center text-sm text-[#66708A]"
              >
                Your photo shows up here once you add it
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <h3 className="min-w-0 break-words text-lg font-semibold leading-snug">
            {values.title.trim() || "Product title"}
          </h3>
          <span className="shrink-0 rounded-full bg-[#19224A] px-2.5 py-1 text-xs font-medium text-white">
            {CATEGORIES[categoryKey].label}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="text-xl font-semibold">{money(finalPrice)}</span>
          {discount > 0 && price > 0 && (
            <>
              <span className="text-sm text-[#66708A] line-through">{money(price)}</span>
              <span className="rounded-md bg-[#C2412D]/10 px-1.5 py-0.5 text-xs font-medium text-[#C2412D]">
                {discount}% off
              </span>
            </>
          )}
        </div>

        <p className="mt-2 text-sm text-[#66708A]">
          {[values.color.trim(), values.fabric.trim(), values.gsm ? `${values.gsm} GSM` : ""]
            .filter(Boolean)
            .join(", ") || "Color, fabric and weight"}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Sizes">
          <AnimatePresence initial={false}>
            {filledSizes.map((s) => (
              <motion.span
                key={s.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex h-8 min-w-8 items-center justify-center rounded-md border border-[#DDE1EA] px-2 text-sm font-medium"
              >
                {s.size.toUpperCase()}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {tags.length > 0 && (
          <p className="mt-4 break-words text-sm text-[#66708A]">
            {tags.map((t) => `#${t}`).join(" ")}
          </p>
        )}
      </div>

      <div className="mx-auto mt-5 max-w-sm">
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="text-[#66708A]">Ready to publish</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#DDE1EA]">
          <motion.div
            className="h-full rounded-full bg-[#19224A]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          />
        </div>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main form                                                                  */
/* -------------------------------------------------------------------------- */
export default function AddProductForm({ product = null, stats = null }) {
  const isEdit = Boolean(product?._id);
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const fileRef = useRef(null);

  const [initial] = useState(() => buildInitial(product));
  const [categoryKey, setCategoryKey] = useState(initial.categoryKey);
  const [values, setValues] = useState(initial.values);
  const [sizes, setSizes] = useState(initial.sizes);
  const [tags, setTags] = useState(initial.tags);
  const [tagDraft, setTagDraft] = useState("");
  const [imageUrl, setImageUrl] = useState(initial.imageUrl);
  const [preview, setPreview] = useState(initial.imageUrl);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  /* ---- Lenis smooth scroll, driven by the GSAP ticker -------------------- */
  useEffect(() => {
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reduceMotion]);

  /* ---- GSAP: one orchestrated page-load sequence ------------------------- */
  useIsoLayoutEffect(() => {
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero-line]", { yPercent: 110, duration: 0.85, stagger: 0.09 })
        .from("[data-hero-stat]", { opacity: 0, y: 12, duration: 0.5, stagger: 0.08 }, "-=0.45")
        .from("[data-section]", { opacity: 0, y: 22, duration: 0.6, stagger: 0.08 }, "-=0.35")
        .from("[data-preview]", { opacity: 0, x: 24, duration: 0.7 }, "-=0.7");
    }, rootRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  /* ---- Toast auto-dismiss ------------------------------------------------ */
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  /* ---- Helpers ----------------------------------------------------------- */
  const clearError = (name) =>
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: _removed, ...rest } = prev;
      return rest;
    });

  const setValue = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    clearError(name);
  };

  const switchCategory = (key) => {
    if (key === categoryKey || isEdit) return;
    const prev = CATEGORIES[categoryKey];
    const next = CATEGORIES[key];

    setTags((t) => [next.tag, ...t.filter((x) => x !== prev.tag && x !== next.tag)]);
    setSizes((s) => (s.every((r) => !r.length && !r.width) ? presetSizes(key) : s));
    setCategoryKey(key);
  };

  /* ---- Sizes ------------------------------------------------------------- */
  const updateSize = (id, field, value) => {
    setSizes((rows) => rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    clearError("sizes");
  };
  const addSize = () => setSizes((rows) => [...rows, { id: nextId(), size: "", length: "", width: "" }]);
  const removeSize = (id) => setSizes((rows) => (rows.length > 1 ? rows.filter((r) => r.id !== id) : rows));

  /* ---- Tags -------------------------------------------------------------- */
  const addTag = (raw) => {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (!tag) return;
    setTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]));
    setTagDraft("");
  };

  const onTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagDraft);
    } else if (e.key === "Backspace" && !tagDraft) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  /* ---- Image upload (imgbb) --------------------------------------------- */
  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, imageUrl: "Choose a JPG, PNG or WebP image" }));
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setErrors((p) => ({ ...p, imageUrl: `Image must be under ${MAX_IMAGE_MB} MB` }));
      return;
    }

    const previousUrl = imageUrl;
    const local = URL.createObjectURL(file);
    setPreview(local);
    setUploading(true);
    clearError("imageUrl");

    const res = await uploadToImgbb(file);

    setUploading(false);
    URL.revokeObjectURL(local);

    if (res.success) {
      setImageUrl(res.url);
      setPreview(res.url);
    } else {
      setImageUrl(previousUrl);
      setPreview(previousUrl);
      setErrors((p) => ({ ...p, imageUrl: res.message }));
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const removeImage = () => {
    setImageUrl("");
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ---- Validation -------------------------------------------------------- */
  const validate = () => {
    const e = {};
    if (!values.title.trim()) e.title = "Enter a product title";
    if (!(Number(values.price) > 0)) e.price = "Enter a price greater than 0";

    const discount = Number(values.discount);
    if (values.discount === "" || !(discount >= 0 && discount <= 100)) e.discount = "Use a number from 0 to 100";

    if (values.stock === "" || !(Number(values.stock) >= 0) || !Number.isInteger(Number(values.stock)))
      e.stock = "Enter a whole number, 0 or more";

    if (!values.color.trim()) e.color = "Enter the color";
    if (!values.fabric.trim()) e.fabric = "Enter the fabric";
    if (!(Number(values.gsm) > 0)) e.gsm = "Enter the GSM, for example 160";
    if (values.description.trim().length < 20) e.description = "Write at least 20 characters";
    if (!imageUrl) e.imageUrl = "Upload a product photo";

    const labels = sizes.map((s) => s.size.trim().toUpperCase());
    const rowsOk = sizes.every(
      (s) => s.size.trim() && Number(s.length) > 0 && Number(s.width) > 0
    );
    if (!rowsOk) e.sizes = "Fill in the size, length and width for every row, or remove the empty row";
    else if (new Set(labels).size !== labels.length) e.sizes = "Each size can only appear once";

    return e;
  };

  /* ---- Submit ------------------------------------------------------------ */
  const reset = () => {
    const fresh = buildInitial(null);
    setCategoryKey(fresh.categoryKey);
    setValues(fresh.values);
    setSizes(fresh.sizes);
    setTags(fresh.tags);
    setImageUrl("");
    setPreview("");
    setErrors({});
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting || uploading) return;

    const found = validate();
    setErrors(found);

    if (Object.keys(found).length) {
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }

    const cfg = CATEGORIES[categoryKey];
    const payload = {
      title: values.title.trim(),
      price: Number(values.price),
      imageUrl,
      sizes: sizes.map((s) => ({
        size: s.size.trim().toUpperCase(),
        length: `${Number(s.length)} inch`,
        width: `${Number(s.width)} inch`,
      })),
      color: values.color.trim(),
      fabric: values.fabric.trim(),
      gsm: Number(values.gsm),
      description: values.description.trim(),
      category: cfg.category,
      stock: Number(values.stock),
      discount: Number(values.discount),
      tags,
      care: values.care.trim(),
    };

    setSubmitting(true);
    const res = isEdit
      ? await updateData(categoryKey, product._id, payload)
      : await postData(categoryKey, payload);
    // On success the server action redirects to /men/punjabi or /women/topcrop,
    // so we only get here when something went wrong.
    setSubmitting(false);
    if (res && !res.success) setToast({ type: "error", text: res.message });
  };

  /* ---- Completeness ------------------------------------------------------ */
  const checks = [
    values.title.trim(),
    Number(values.price) > 0,
    imageUrl,
    values.color.trim(),
    values.fabric.trim(),
    Number(values.gsm) > 0,
    values.description.trim().length >= 20,
    values.stock !== "",
    sizes.every((s) => s.size.trim() && Number(s.length) > 0 && Number(s.width) > 0),
  ];
  const progress = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  const busy = submitting || uploading;
  const sizeRowInvalid = (s, field) =>
    Boolean(errors.sizes) &&
    (field === "size" ? !s.size.trim() : !(Number(s[field]) > 0));

  /* ---- UI ---------------------------------------------------------------- */
  return (
    <div ref={rootRef} className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            <span className="block overflow-hidden pb-1">
              <span data-hero-line className="block">
                {isEdit ? "Edit product" : "Add a product"}
              </span>
            </span>
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#66708A]">
            <span className="block overflow-hidden">
              <span data-hero-line className="block">
                {isEdit
                  ? "Update the details and save. The change shows up in the shop right away."
                  : "Pick a category, fill in the details and publish it to the shop."}
              </span>
            </span>
          </p>
        </div>

        {stats && (
          <dl className="flex gap-8">
            <div data-hero-stat>
              <dt className="text-sm text-[#66708A]">Punjabi in shop</dt>
              <dd className="text-2xl font-semibold">{stats.punjabi ?? "–"}</dd>
            </div>
            <div data-hero-stat>
              <dt className="text-sm text-[#66708A]">Top Crop in shop</dt>
              <dd className="text-2xl font-semibold">{stats.topCrop ?? "–"}</dd>
            </div>
          </dl>
        )}
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-2xl border border-[#DDE1EA] bg-white p-5 sm:p-8"
        >
          {/* Category */}
          <Section
            title="Category"
            description={
              isEdit
                ? "The category can't be changed after the product is created."
                : "This decides which collection the product is saved to."
            }
          >
            <div
              role="radiogroup"
              aria-label="Category"
              className="inline-flex rounded-xl bg-[#F1F3F7] p-1"
            >
              {Object.values(CATEGORIES).map((c) => {
                const active = c.key === categoryKey;
                return (
                  <button
                    key={c.key}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    disabled={isEdit && !active}
                    onClick={() => switchCategory(c.key)}
                    className={`relative rounded-lg px-5 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#19224A] disabled:cursor-not-allowed disabled:opacity-40 ${
                      active ? "text-white" : "text-[#19224A]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="category-pill"
                        className="absolute inset-0 rounded-lg bg-[#19224A]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Details */}
          <Section title="Details">
            <div className="grid gap-5">
              <Field id="title" label="Title" error={errors.title}>
                <Input
                  id="title"
                  value={values.title}
                  onChange={setValue("title")}
                  invalid={!!errors.title}
                  placeholder={categoryKey === "punjabi" ? "Classic White Cotton Punjabi" : "Ribbed Cotton Crop Top"}
                />
              </Field>
              <Field
                id="description"
                label="Description"
                error={errors.description}
                hint={`${values.description.trim().length} characters`}
              >
                <textarea
                  id="description"
                  rows={4}
                  value={values.description}
                  onChange={setValue("description")}
                  aria-invalid={errors.description ? "true" : undefined}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  placeholder="Fit, feel and when to wear it."
                  className={`${baseInput} h-auto resize-y py-3 leading-relaxed ${
                    errors.description ? "border-[#C2412D]" : "border-[#DDE1EA] focus:border-[#19224A]"
                  }`}
                />
              </Field>
            </div>
          </Section>

          {/* Photo */}
          <Section title="Photo" description={`JPG, PNG or WebP, up to ${MAX_IMAGE_MB} MB.`}>
            <input
              ref={fileRef}
              id="image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {preview ? (
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="" className="h-24 w-24 rounded-lg border border-[#DDE1EA] object-cover" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{uploading ? "Uploading…" : "Photo ready"}</p>
                  <div className="mt-2 flex gap-4 text-sm">
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileRef.current?.click()}
                      className="font-medium underline underline-offset-4 disabled:opacity-50"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={removeImage}
                      className="font-medium text-[#C2412D] underline underline-offset-4 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                  {uploading && (
                    <div className="mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-[#DDE1EA]">
                      <motion.div
                        className="h-full w-1/3 rounded-full bg-[#19224A]"
                        animate={{ x: ["-100%", "300%"] }}
                        transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <label
                htmlFor="image"
                tabIndex={0}
                aria-invalid={errors.imageUrl ? "true" : undefined}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center outline-none transition focus-visible:ring-4 focus-visible:ring-[#19224A]/10 ${
                  dragging
                    ? "border-[#19224A] bg-[#19224A]/5"
                    : errors.imageUrl
                    ? "border-[#C2412D]"
                    : "border-[#DDE1EA] hover:border-[#9AA3B8]"
                }`}
              >
                <span className="text-sm font-medium">Drop a photo here or click to browse</span>
                <span className="mt-1 text-sm text-[#66708A]">A square photo works best</span>
              </label>
            )}
            {errors.imageUrl && <p className="mt-2 text-sm text-[#C2412D]">{errors.imageUrl}</p>}
          </Section>

          {/* Sizes */}
          <Section title="Sizes" description="Measurements are saved in inches.">
            <div className="hidden grid-cols-[1fr_1fr_1fr_36px] gap-3 pb-2 text-sm text-[#66708A] sm:grid">
              <span>Size</span>
              <span>Length</span>
              <span>Width</span>
              <span />
            </div>

            <div>
              <AnimatePresence initial={false}>
                {sizes.map((row) => (
                  <motion.div
                    key={row.id}
                    layout="position"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-[1fr_1fr_1fr_36px] gap-3 px-1 py-1.5">
                      <Input
                        id={`size-${row.id}`}
                        aria-label="Size"
                        value={row.size}
                        onChange={(e) => updateSize(row.id, "size", e.target.value)}
                        invalid={sizeRowInvalid(row, "size")}
                        placeholder="M"
                        className="uppercase"
                      />
                      <Input
                        id={`length-${row.id}`}
                        aria-label="Length in inches"
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.5"
                        value={row.length}
                        onChange={(e) => updateSize(row.id, "length", e.target.value)}
                        invalid={sizeRowInvalid(row, "length")}
                        suffix="in"
                      />
                      <Input
                        id={`width-${row.id}`}
                        aria-label="Width in inches"
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.5"
                        value={row.width}
                        onChange={(e) => updateSize(row.id, "width", e.target.value)}
                        invalid={sizeRowInvalid(row, "width")}
                        suffix="in"
                      />
                      <button
                        type="button"
                        onClick={() => removeSize(row.id)}
                        disabled={sizes.length === 1}
                        aria-label={`Remove size ${row.size || "row"}`}
                        className="flex h-11 w-9 items-center justify-center rounded-lg text-[#66708A] outline-none transition hover:bg-[#F1F3F7] hover:text-[#C2412D] focus-visible:ring-2 focus-visible:ring-[#19224A] disabled:opacity-30"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {errors.sizes && <p className="mt-2 text-sm text-[#C2412D]">{errors.sizes}</p>}

            <button
              type="button"
              onClick={addSize}
              className="mt-3 rounded-lg border border-[#DDE1EA] px-4 py-2 text-sm font-medium outline-none transition hover:border-[#19224A] focus-visible:ring-4 focus-visible:ring-[#19224A]/10"
            >
              Add a size
            </button>
          </Section>

          {/* Fabric */}
          <Section title="Fabric and care">
            <div className="grid gap-5 sm:grid-cols-3">
              <Field id="color" label="Color" error={errors.color}>
                <Input id="color" value={values.color} onChange={setValue("color")} invalid={!!errors.color} placeholder="White" />
              </Field>
              <Field id="fabric" label="Fabric" error={errors.fabric}>
                <Input id="fabric" value={values.fabric} onChange={setValue("fabric")} invalid={!!errors.fabric} placeholder="Cotton" />
              </Field>
              <Field id="gsm" label="Weight" error={errors.gsm}>
                <Input
                  id="gsm"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={values.gsm}
                  onChange={setValue("gsm")}
                  invalid={!!errors.gsm}
                  suffix="GSM"
                  placeholder="160"
                />
              </Field>
              <Field id="care" label="Care instructions" className="sm:col-span-3">
                <Input id="care" value={values.care} onChange={setValue("care")} placeholder="Machine wash cold, tumble dry low" />
              </Field>
            </div>
          </Section>

          {/* Price */}
          <Section title="Price and stock">
            <div className="grid gap-5 sm:grid-cols-3">
              <Field id="price" label="Price" error={errors.price}>
                <Input
                  id="price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={values.price}
                  onChange={setValue("price")}
                  invalid={!!errors.price}
                  suffix={CURRENCY}
                  placeholder="1850"
                />
              </Field>
              <Field id="discount" label="Discount" error={errors.discount}>
                <Input
                  id="discount"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  value={values.discount}
                  onChange={setValue("discount")}
                  invalid={!!errors.discount}
                  suffix="%"
                />
              </Field>
              <Field id="stock" label="In stock" error={errors.stock}>
                <Input
                  id="stock"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  value={values.stock}
                  onChange={setValue("stock")}
                  invalid={!!errors.stock}
                  placeholder="45"
                />
              </Field>
            </div>
          </Section>

          {/* Tags */}
          <Section title="Tags" description="Press Enter or comma after each tag.">
            <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-[#DDE1EA] bg-white p-2 focus-within:border-[#19224A] focus-within:ring-4 focus-within:ring-[#19224A]/10">
              <AnimatePresence initial={false}>
                {tags.map((tag) => (
                  <motion.span
                    key={tag}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    className="flex items-center gap-1 rounded-md bg-[#F1F3F7] py-1 pl-2.5 pr-1 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                      aria-label={`Remove tag ${tag}`}
                      className="flex h-5 w-5 items-center justify-center rounded text-[#66708A] hover:text-[#C2412D]"
                    >
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
              <input
                aria-label="Add a tag"
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={onTagKeyDown}
                onBlur={() => addTag(tagDraft)}
                placeholder={tags.length ? "" : "cotton, white, bestseller"}
                className="min-w-[8rem] flex-1 bg-transparent px-1.5 py-1 text-[15px] outline-none placeholder:text-[#9AA3B8]"
              />
            </div>
          </Section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#DDE1EA] pt-6 sm:flex-row sm:items-center sm:justify-end">
            {!isEdit && (
              <button
                type="button"
                onClick={reset}
                disabled={busy}
                className="rounded-lg px-5 py-3 text-sm font-medium text-[#66708A] outline-none transition hover:text-[#19224A] focus-visible:ring-4 focus-visible:ring-[#19224A]/10 disabled:opacity-50"
              >
                Clear form
              </button>
            )}
            <motion.button
              type="submit"
              disabled={busy}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#19224A] px-7 py-3 text-sm font-semibold text-white outline-none transition hover:bg-[#232F63] focus-visible:ring-4 focus-visible:ring-[#19224A]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                  <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
              {submitting ? "Saving…" : isEdit ? "Save changes" : "Add product"}
            </motion.button>
          </div>
        </form>

        <HangTag
          values={values}
          sizes={sizes}
          tags={tags}
          preview={preview}
          categoryKey={categoryKey}
          progress={progress}
        />
      </div>

      {/* Toast */}
      <div aria-live="polite" role="status" className="pointer-events-none fixed bottom-5 right-5 z-50">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.text}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className={`pointer-events-auto max-w-sm rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
                toast.type === "success" ? "bg-[#19224A]" : "bg-[#C2412D]"
              }`}
            >
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}