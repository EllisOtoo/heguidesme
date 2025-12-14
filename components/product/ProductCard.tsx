import Link from "next/link";
import Image from "next/image";
import { Product } from "@prisma/client";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Format price from cents to currency
  const formattedPrice = new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(product.price / 100);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100"
    >
      {/* Product Image */}
      <div className="aspect-[3/4] relative bg-background-mist overflow-hidden">
        <Image
          src={product.images[0] || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Badge */}
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-medium text-text-dark px-3 py-1 rounded-full">
          {product.category === "BUNDLE" ? "Gift Bundle" : "Journal"}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-text-dark mb-2 group-hover:text-primary-blue transition-colors">
          {product.name}
        </h3>
        <p className="text-text-light text-sm line-clamp-2 mb-4">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-primary-blue font-bold text-lg">
            {formattedPrice}
          </span>
          <span className="text-sm text-text-light group-hover:text-primary-blue transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
