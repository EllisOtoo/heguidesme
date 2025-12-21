import { getProducts } from "@/actions/get-products";
import ProductCard from "@/components/product/ProductCard";
import Hero from "@/components/home/Hero";

export const dynamic = "force-dynamic";

export default async function Home() {
  return <div>Test</div>
  const products = await getProducts();

  return (
    <div>
      {/* Hero Section */}
      <Hero />

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
