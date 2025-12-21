"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { Product, ProductVariant } from "../../prisma/generated/client";

interface ProductInteractionProps {
  product: Product & { variants: ProductVariant[] };
}

export default function ProductInteraction({ product }: ProductInteractionProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const currentPrice = selectedVariant?.price ?? product.price;
  const currentInventory = selectedVariant?.inventory ?? product.inventory;
  const currentImage = selectedVariant?.image ?? product.images[0] ?? "/placeholder.png";

  const formattedPrice = new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(currentPrice / 100);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      slug: product.slug,
      name: product.name,
      price: currentPrice,
      image: currentImage,
      category: product.category as any,
    }, quantity);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, currentInventory)));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Product Image */}
      <div className="aspect-[3/4] relative bg-background-mist rounded-2xl overflow-hidden shadow-sm">
        <Image
          src={currentImage}
          alt={product.name}
          fill
          className="object-cover transition-all duration-500"
          priority
        />
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-medium text-text-dark px-3 py-1 rounded-full shadow-sm">
          {product.category === "BUNDLE" ? "Gift Bundle" : "Journal"}
        </span>
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-center">
        <h1 className="font-serif text-4xl font-bold text-text-dark mb-2">
          {product.name}
        </h1>
        
        {selectedVariant && (
          <p className="text-text-light font-medium mb-4">
            {selectedVariant.name}
          </p>
        )}

        <p className="text-3xl text-primary-blue font-bold mb-6">
          {formattedPrice}
        </p>
        
        <p className="text-text-light leading-relaxed mb-8">
          {product.description}
        </p>

        {/* Variant Selection */}
        {product.variants.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-4">
              Select Option
            </h3>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => {
                    setSelectedVariant(variant);
                    setQuantity(1); // Reset quantity when variant changes
                  }}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    selectedVariant?.id === variant.id
                      ? "border-primary-blue bg-primary-blue/5 text-primary-blue"
                      : "border-gray-200 text-text-light hover:border-gray-400"
                  }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity and Availability */}
        <div className="flex flex-row items-center gap-8 mb-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider">
              Quantity
            </h3>
            <div className="flex items-center gap-4 bg-gray-50 p-1 rounded-full border border-gray-100">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-text-light hover:text-text-dark disabled:opacity-30 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-text-dark">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= currentInventory}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-text-light hover:text-text-dark disabled:opacity-30 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider">
              Availability
            </h3>
            <div className="h-12 flex items-center">
              {currentInventory > 0 ? (
                <span className="text-accent-green font-medium text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
                  {currentInventory} in stock
                </span>
              ) : (
                <span className="text-red-500 font-medium text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Out of Stock
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={currentInventory === 0}
          className={`w-full font-bold py-5 rounded-full transition-all flex items-center justify-center gap-3 shadow-lg ${
            isAdded
              ? "bg-accent-green text-text-dark translate-y-[-2px] shadow-accent-green/20"
              : "bg-primary-blue text-white hover:opacity-95 hover:translate-y-[-2px] shadow-primary-blue/20"
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none`}
        >
          {isAdded ? (
            <>
              <Check className="w-5 h-5" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button>

        <p className="text-xs text-text-light mt-6 text-center italic">
          Free delivery within Accra. Other regions may incur standard shipping
          costs.
        </p>
      </div>
    </div>
  );
}
