"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
 // <- your Better Auth server instance, fix the path if different

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Only the key names are public. Real paths stay on the server.
const PATHS = {
  punjabi: "/api/punjabi",
  topCrop: "/api/topCrop",
};

const isAdmin = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.role === "admin";
};

const mutate = async (collection, suffix, method, body) => {
  const path = PATHS[collection];
  if (!path) return { success: false, message: `Unknown collection "${collection}"`, data: null };

  // 1) Role check on the server, can't be bypassed from the browser
  if (!(await isAdmin())) {
    return { success: false, message: "Only admins can do this", data: null };
  }

  try {
    const res = await fetch(`${API_URL}${path}${suffix}`, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        // 2) Secret that only this Next.js server knows, Express checks it
        "x-admin-secret": process.env.ADMIN_API_SECRET,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (!res.ok) {
      const message = data?.errors?.join(", ") || data?.error || `Request failed (${res.status})`;
      return { success: false, message, data: null };
    }

    return { success: true, message: data?.message || "Done", data };
  } catch (error) {
    console.error(`${method} ${path} failed:`, error);
    return { success: false, message: "Could not reach the server", data: null };
  }
};

export async function postData(collection, payload) {
  return mutate(collection, "", "POST", payload);
}

export async function updateData(collection, id, payload) {
  return mutate(collection, `/${id}`, "PUT", payload);
}

export async function deleteData(collection, id) {
  return mutate(collection, `/${id}`, "DELETE");
}