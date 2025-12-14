"use client";

import { useCartStore } from "@/store/cart-store";
import { Product } from "@prisma/client";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
}

export default function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      category: product.category,
    });
    
    // Simple feedback animation
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled}
      className={`w-full font-medium py-4 rounded-full transition-all flex items-center justify-center gap-2 ${
        isAdded 
          ? "bg-accent-green text-text-dark"
          : "bg-primary-blue text-white hover:opacity-90"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
        {isAdded ? (
            <>Added to Cart</>
        ) : (
            <>
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
            </>
        )}
    </button>
  );
}
