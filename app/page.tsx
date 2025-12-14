import { getProducts } from "@/actions/get-products";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";

export default async function Home() {
  const products = await getProducts();

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-white to-background-mist/30">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-text-dark mb-6 tracking-tight">
          Find Your Quiet Place
        </h1>
        <p className="text-lg md:text-xl text-text-light max-w-2xl mb-10 leading-relaxed">
          Discover our collection of journals and spiritual growth tools
          designed to help you pause, reflect, and connect.
        </p>
        <Link
          href="#products"
          className="bg-primary-blue text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
        >
          Shop Now
        </Link>
      </section>

      {/* Products Section */}
      <section id="products" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-text-dark mb-4">
            Our Products
          </h2>
          <p className="text-text-light max-w-xl mx-auto">
            Choose from our carefully curated selection of spiritual growth
            tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
