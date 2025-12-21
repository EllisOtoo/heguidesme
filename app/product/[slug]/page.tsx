import { getProductBySlug } from "@/actions/get-products";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductInteraction from "@/components/product/ProductInteraction";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-text-light hover:text-primary-blue transition-colors">
            Home
          </Link>
          <span className="mx-2 text-text-light">/</span>
          <span className="text-text-dark font-medium">{product.name}</span>
        </nav>

        <ProductInteraction product={product as any} />
      </div>
    </div>
  );
}
