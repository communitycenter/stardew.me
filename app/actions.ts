"use server";

import { Player } from "@/lib/types/player.types";
import { Redis } from "@upstash/redis";

export async function uploadSaveFile(players: Player[]) {
  try {
    const playerData = {
      shirt: "-1",
      ...players[0],
      background: "day",
      name: undefined, // Remove name from payload
    };

    console.log(JSON.stringify(playerData, null, 2));

    const response = await fetch("https://api.stardew.me/dev/farmhand", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "JzMIh4isUb6gx3vgp7cTU3JlIoZDAxTU9lLutev0",
      },
      body: JSON.stringify(playerData),
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (!response.ok) {
      throw new Error(data.error || "Failed to upload player data");
    }

    return { success: true, ...data };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: "Failed to upload file" };
  }
}

interface RecentFarmhand {
  player_hash: string;
}

export async function getRecents(): Promise<RecentFarmhand[]> {
  const redis = new Redis({
    url: "https://pet-skylark-48249.upstash.io",
    token: "Arx5AAIgcDFWiruI6dLC8PeYjDvw_aMCyqCzNJln-mw1qPqDmzeTUw",
  });

  const hashes = await redis.zrange<string[]>("recent_farmhands", 0, -1, {
    rev: true,
  });

  return hashes.map((hash) => ({ player_hash: hash }));
}
