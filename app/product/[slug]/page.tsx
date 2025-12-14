import { getProductBySlug } from "@/actions/get-products";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(product.price / 100);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-text-light hover:text-primary-blue">
            Home
          </Link>
          <span className="mx-2 text-text-light">/</span>
          <span className="text-text-dark font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-[3/4] relative bg-background-mist rounded-2xl overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-medium text-text-dark px-3 py-1 rounded-full">
              {product.category === "BUNDLE" ? "Gift Bundle" : "Journal"}
            </span>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <h1 className="font-serif text-4xl font-bold text-text-dark mb-4">
              {product.name}
            </h1>
            <p className="text-2xl text-primary-blue font-bold mb-6">
              {formattedPrice}
            </p>
            <p className="text-text-light leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mb-8">
              {product.inventory > 0 ? (
                <span className="text-accent-green font-medium text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent-green rounded-full"></span>
                  In Stock ({product.inventory} available)
                </span>
              ) : (
                <span className="text-red-500 font-medium text-sm">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full bg-primary-blue text-white font-medium py-4 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={product.inventory === 0}
            >
              Add to Cart
            </button>

            <p className="text-xs text-text-light mt-4 text-center">
              Free delivery within Accra. Other regions may incur shipping
              costs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params for known products
export async function generateStaticParams() {
  const { prisma } = await import("@/lib/prisma");
  const products = await prisma.product.findMany({
    select: { slug: true },
  });
  return products.map((product) => ({
    slug: product.slug,
  }));
}
