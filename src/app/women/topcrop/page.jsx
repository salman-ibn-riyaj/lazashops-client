import TopCropCard from '@/components/TopCropCard';
import { serverFetch } from '@/lib/serverFetch/server';


const TopCropPage = async () => {
  const topCrops = await serverFetch(`/api/topCrop`);

  // Handle empty / error state
  if (!topCrops || !Array.isArray(topCrops) || topCrops.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 dark:text-white mb-2">
          No products found
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please check back soon for new arrivals.
        </p>
      </div>
    );
  }

  return (
    <main className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Hero / Collection Header */}
      <section className="border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          {/* Breadcrumb */}
          <nav className="mb-4 sm:mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <li>
                <a
                  href="/"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Women
                </span>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-900 dark:text-white font-medium">
                Top Crop
              </li>
            </ol>
          </nav>

          {/* Title + Count */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 dark:text-white">
                Top Crop
              </h1>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
                Effortless silhouettes crafted for everyday wear. Discover our
                latest collection of crop tops designed to elevate any look.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              <span className="font-medium text-gray-900 dark:text-white">
                {topCrops.length}
              </span>{' '}
              {topCrops.length === 1 ? 'product' : 'products'}
            </p>
          </div>
        </div>
      </section>

      {/* Toolbar (Sort / Filter placeholder — Shopify style) */}
      <section className="border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              type="button"
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {/* Filter icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                />
              </svg>
              Filter
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              <span className="hidden sm:inline text-gray-500 dark:text-gray-400">
                Sort by:
              </span>
              <button
                type="button"
                className="flex items-center gap-1 font-medium hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Featured
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:gap-x-6 lg:gap-y-12">
          {topCrops.map((product) => (
            <TopCropCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-16 sm:h-20" />
    </main>
  );
};

export default TopCropPage;