'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "@/store/store";
import { updateQuantity, removeFromCart } from "@/store/slices/cartSlice";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  return (
    <div>
      {/* Your cart content */}
    </div>
  );
} 