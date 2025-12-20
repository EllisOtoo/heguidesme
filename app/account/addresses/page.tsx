import { getMyAddresses } from "@/actions/account";

type AddressesResult = Awaited<ReturnType<typeof getMyAddresses>>;
type AddressType = NonNullable<AddressesResult["addresses"]>[number];

export default async function AddressesPage() {
  const result = await getMyAddresses();
  const addresses: AddressType[] = result.addresses || [];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-text-dark mb-8">Addresses</h1>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="font-serif text-xl font-bold text-text-dark mb-2">No saved addresses</h2>
          <p className="text-text-light">
            Your shipping addresses from orders will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <address className="not-italic text-text-dark leading-relaxed">
                {address.street}<br />
                {address.city}
                {address.state && `, ${address.state}`}<br />
                {address.zip && `${address.zip}, `}{address.country}
              </address>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-text-light mt-6">
        Note: In this version, addresses are saved automatically from your orders.
      </p>
    </div>
  );
}
