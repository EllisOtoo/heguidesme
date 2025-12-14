export default function OutletsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-text-dark mb-6 text-center">Find a Store</h1>
        <p className="text-text-light text-center mb-12">
          Prefer to buy in person? Visit one of our partner locations.
        </p>
        
        <div className="grid gap-6">
          {/* Outlet Item */}
          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-text-dark">Grace Bookshop</h3>
              <p className="text-text-light mt-1">123 Main Street, Accra, Ghana</p>
              <p className="text-sm text-primary-blue mt-2">Open 9AM - 5PM</p>
            </div>
            <a 
              href="#" 
              className="mt-4 md:mt-0 px-6 py-2 border border-gray-200 rounded-full text-sm font-medium text-text-dark hover:bg-gray-50 text-center"
            >
              Get Directions
            </a>
          </div>

          {/* Outlet Item */}
          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-text-dark">Kingdom Books</h3>
              <p className="text-text-light mt-1">45 Independence Ave, Accra, Ghana</p>
              <p className="text-sm text-primary-blue mt-2">Open 8AM - 6PM</p>
            </div>
            <a 
              href="#" 
              className="mt-4 md:mt-0 px-6 py-2 border border-gray-200 rounded-full text-sm font-medium text-text-dark hover:bg-gray-50 text-center"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
