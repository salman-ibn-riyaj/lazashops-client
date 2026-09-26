import PunjabiCard from '@/components/PunjabiCard';
import { serverFetch } from '@/lib/serverFetch/server';


const PunjabiPage = async () => {
  const punjabis = await serverFetch(`/api/punjabi`);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-16">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-light tracking-wider uppercase text-gray-900">
          Best Sellers
        </h1>
        <div className="w-12 h-px bg-gray-300 mt-4" />
      </div>

      {/* Products Grid */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 pb-12 sm:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {punjabis && punjabis.length > 0 ? (
            punjabis.map((item) => (
              <PunjabiCard 
                key={item._id} 
                product={item} 
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-12">
              No products found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PunjabiPage;