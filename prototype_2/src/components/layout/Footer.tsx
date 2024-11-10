import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">
              ShopSmart is your one-stop destination for all your shopping needs. 
              We offer a wide range of products at competitive prices.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="hover:underline">FAQs</Link></li>
              <li><Link href="/shipping" className="hover:underline">Shipping Information</Link></li>
              <li><Link href="/returns" className="hover:underline">Return Policy</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex">
              <Input type="email" placeholder="Your email" className="rounded-r-none" />
              <Button className="rounded-l-none">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-secondary-foreground/10 text-center text-sm">
          © {new Date().getFullYear()} ShopSmart. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 