import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";
import DifferentialPrivacyDemo from '@/components/DifferentialPrivacyDemo';

export default function Home() {
  return (
    <main>
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">Welcome to ShopSmart</h2>
            <p className="text-xl mb-8">
              Discover amazing deals on all your favorite products.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-white text-black">Shop Now</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
          <ProductGrid />
        </div>
      </section>

      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <DifferentialPrivacyDemo />
        </div>
      </section> */}
    </main>
  );
}
