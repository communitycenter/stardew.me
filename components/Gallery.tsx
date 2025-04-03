"use client";

import { useEffect, useState } from "react";
import { getRecents } from "@/app/actions";
import Image from "next/image";

interface RecentFarmhand {
  player_hash: string;
}

export default function Gallery() {
  const [recentFarmhands, setRecentFarmhands] = useState<RecentFarmhand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecents() {
      try {
        const data = await getRecents();
        setRecentFarmhands(data);
      } catch (error) {
        console.error("Failed to load recent farmhands:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRecents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-solid"></div>
      </div>
    );
  }

  if (recentFarmhands.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No recent farmhands found
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-8 gap-4">
      {recentFarmhands.map((farmhand) => (
        <div
          key={farmhand.player_hash}
          className="relative aspect-square rounded-lg overflow-hidden transition-colors"
        >
          <Image
            src={`https://cdn.stardew.me/prod/farmhands/${farmhand.player_hash}.png`}
            alt={`Farmhand ${farmhand.player_hash}`}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
