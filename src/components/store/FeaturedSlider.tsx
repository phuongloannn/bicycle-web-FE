"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types/store";
import { StoreService } from "@/services/StoreService";

export default function FeaturedSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const api = new StoreService();
      const all = await api.getProducts();
      setProducts(all.slice(0, 3)); // Lấy 3 sản phẩm nổi bật
    }
    load();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (products.length === 0) return null;

  const p = products[index];

  const imageUrl =
    p.image ||
    (p as any).image_url ||
    (p as any).imageUrl ||
    "/images/placeholder-product.jpg";

  return (
    <div className="w-full bg-gray-900 text-white py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-8">

        {/* LEFT CONTENT */}
        <div className="space-y-6 w-1/2">
          <h2 className="text-4xl font-bold">Sản phẩm nổi bật</h2>

          <h3 className="text-2xl font-semibold text-blue-300">{p.name}</h3>

          <p className="text-gray-300 line-clamp-3">{p.description}</p>

          <Link
            href={`/store/product/${p.id}`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Xem chi tiết
          </Link>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-1/2 relative">
          <img
            src={imageUrl}
            className="w-full h-80 object-contain rounded-xl shadow-lg bg-white p-4"
          />

          {/* SLIDER DOTS */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full ${
                  i === index ? "bg-blue-400" : "bg-gray-600"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
