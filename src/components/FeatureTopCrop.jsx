import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { serverFetch } from '@/lib/serverFetch/server';
import TopCropCard from '@/components/TopCropCard';

const FeaturedTopCrop = async () => {
  const topCrops = await serverFetch(`/api/topCrop`);

  if (!topCrops || !Array.isArray(topCrops) || topCrops.length === 0) {
    return null;
  }

  const featured = topCrops.slice(0, 8);

  return (
    <section className="w-full bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 sm:mb-12">
          <div>
            <p className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.25em] text-gray-400 mb-3">
              Featured Collection
            </p>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-gray-900">
              Top Crop
            </h2>

            <div className="w-12 h-px bg-gray-300 mt-4" />

            <p className="mt-4 text-sm sm:text-base text-gray-500 max-w-md leading-relaxed">
              Effortless silhouettes for everyday wear. Elevate your look with
              our latest crop tops.
            </p>
          </div>

          <Link
            href="/women/topcrop"
            className="group hidden sm:inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            <span className="relative">
              See All Products
              <span className="absolute -bottom-1 left-0 w-full h-px bg-gray-900 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </span>
            <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:gap-x-6 lg:gap-y-12">
          {featured.map((product) => (
            <TopCropCard key={product._id} product={product} />
          ))}
        </div>

        {/* See All Button (Mobile) */}
        <div className="sm:hidden mt-10 flex justify-center">
          <Link
            href="/women/topcrop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 active:scale-[0.98] transition-all"
          >
            See All Products
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTopCrop;