'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from 'react-redux';
import { RootState } from "@/store/store";
import { useSession, signOut } from 'next-auth/react';
import SearchBar from '@/components/SearchBar';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/auth/check-admin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: session.user.email }),
          });
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      }
    };

    checkAdminStatus();
  }, [session]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold mr-8">
              ShopSmart
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link href="/" className="hover:text-primary">Home</Link>
              <Link href="/categories" className="hover:text-primary">Categories</Link>
              <Link href="/deals" className="hover:text-primary">Deals</Link>
              <Link href="/about" className="hover:text-primary">About</Link>
              <Link href="/privacy-demo" className="hover:text-primary">
                Privacy Demo
              </Link>
              {isAdmin && (
                <Link href="/admin" className="hover:text-primary">
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  Welcome, {session.user.name}
                </span>
                <Button 
                  variant="ghost" 
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
            )}
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Cart ({mounted ? itemCount : 0} items)</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="px-2 pt-2 pb-4 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md hover:bg-primary-foreground">Home</Link>
            <Link href="/categories" className="block px-3 py-2 rounded-md hover:bg-primary-foreground">Categories</Link>
            <Link href="/deals" className="block px-3 py-2 rounded-md hover:bg-primary-foreground">Deals</Link>
            <Link href="/about" className="block px-3 py-2 rounded-md hover:bg-primary-foreground">About</Link>
            <Link href="/privacy-demo" className="block px-3 py-2 rounded-md hover:bg-primary-foreground">
              Privacy Demo
            </Link>
            {isAdmin && (
              <Link href="/admin" className="block px-3 py-2 rounded-md hover:bg-primary-foreground">
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
} 