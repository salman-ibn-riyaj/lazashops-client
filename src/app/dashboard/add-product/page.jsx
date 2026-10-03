import { Bricolage_Grotesque } from "next/font/google";
import AddProductForm from "@/components/AddProductForm";
import { serverFetch } from "@/lib/serverFetch/server";

// SSR page: no "use client" here. It runs on the server on every request.
export const metadata = {
  title: "Add product | LazaShops Dashboard",
  description: "Add a new Punjabi or Top Crop product to the LazaShops catalogue.",
};

export const dynamic = "force-dynamic";

const font = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

const AddProductPage = async () => {
  // Fetched on the server, so the counts are already in the HTML.
  const [punjabi, topCrop] = await Promise.all([
    serverFetch("/api/punjabi"),
    serverFetch("/api/topCrop"),
  ]);

  const stats = {
    punjabi: Array.isArray(punjabi) ? punjabi.length : null,
    topCrop: Array.isArray(topCrop) ? topCrop.length : null,
  };

  return (
    <main className={`${font.className} min-h-full w-full bg-[#F1F3F7] text-[#19224A]`}>
      <AddProductForm stats={stats} />
    </main>
  );
};

export default AddProductPage;