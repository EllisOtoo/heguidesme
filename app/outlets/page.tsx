const outlets = [
  {
    brand: "Challenge Bookshop",
    locations: [
      { name: "Kokomlemle branch", address: "Near ATTC" },
      { name: "All Challenge Branches", address: "Nationwide" },
    ],
  },
  {
    brand: "Placito Gift shops",
    locations: [
      { name: "Airport shell branch", address: "Airport Shell" },
      { name: "Dzorwulu branch", address: "Dzorwulu" },
      { name: "KIA branch", address: "Kotoka International Airport" },
    ],
  },
  {
    brand: "Motorway Shell",
    locations: [
      { name: "Main Branch", address: "Off the N1, Near 233 place" },
    ],
  },
  {
    brand: "Dansoman Shell",
    locations: [
      { name: "Main Branch", address: "Dansoman" },
    ],
  },
];

export default function OutletsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-text-dark mb-6 text-center">Find a Store</h1>
        <p className="text-text-light text-center mb-12 max-w-2xl mx-auto">
          Prefer to buy in person? Our products are available at these partner locations across the city.
        </p>
        
        <div className="grid gap-12">
          {outlets.map((group) => (
            <div key={group.brand} className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-text-dark border-b border-gray-100 pb-2">
                {group.brand}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {group.locations.map((outlet) => (
                  <div 
                    key={outlet.name} 
                    className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md h-full"
                  >
                    <h3 className="font-serif text-lg font-bold text-text-dark">{outlet.name}</h3>
                    <p className="text-text-light mt-1 text-sm">{outlet.address}</p>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-xs text-primary-gold font-medium uppercase tracking-wider">Authorized Retailer</span>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${outlet.name} ${outlet.address} Accra`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-primary-blue hover:underline"
                      >
                        Directions
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
