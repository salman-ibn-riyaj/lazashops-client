const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Collection registry. The key is what you pass to the helpers below,
 * the path is the Express route that talks to that MongoDB collection.
 */
export const COLLECTIONS = {
  punjabi: { label: "Punjabi", category: "Punjabi", path: "/api/punjabi" },
  topCrop: { label: "Top Crop", category: "Top Crop", path: "/api/topCrop" },
};

/* -------------------------------------------------------------------------- */
/*  READ (your original function, only `options` added)                        */
/* -------------------------------------------------------------------------- */
export const serverFetch = async (path, options = {}) => {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store", ...options });

    if (!res.ok) {
      console.error(`API Error: ${res.status}`);
      return null;
    }

    const text = await res.text();

    if (!text || text.trim() === "") {
      console.warn("Empty response");
      return null;
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

/* -------------------------------------------------------------------------- */
/*  READ shortcuts                                                             */
/* -------------------------------------------------------------------------- */
export const getData = (collection) => {
  const target = COLLECTIONS[collection];
  return target ? serverFetch(target.path) : null;
};

export const getDataById = (collection, id) => {
  const target = COLLECTIONS[collection];
  return target ? serverFetch(`${target.path}/${id}`) : null;
};

/* -------------------------------------------------------------------------- */
/*  IMAGE UPLOAD (imgbb)                                                       */
/* -------------------------------------------------------------------------- */
export const uploadToImgbb = async (file) => {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!key) {
    return { success: false, message: "NEXT_PUBLIC_IMGBB_API_KEY is missing in .env", url: "" };
  }

  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: "POST",
      body: formData,
    });

    const json = await res.json();

    if (!res.ok || !json?.success) {
      return {
        success: false,
        message: json?.error?.message || "Image upload failed",
        url: "",
      };
    }

    return { success: true, message: "Uploaded", url: json.data.display_url || json.data.url };
  } catch (error) {
    console.error("imgbb upload failed:", error);
    return { success: false, message: "Image upload failed. Check your connection.", url: "" };
  }
};