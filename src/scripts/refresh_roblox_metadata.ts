import GameService from "@/services/gameService";
import { supabase } from "@/integrations/supabase/client";

async function main() {
  try {
    console.log("Starting Roblox metadata refresh...");

    // Fetch all games with a roblox_id
    const { data: games, error } = await supabase
      .from("games")
      .select("roblox_id")
      .not("roblox_id", "is", null);

    if (error) {
      console.error("Error fetching games:", error);
      process.exit(1);
    }

    if (!games || games.length === 0) {
      console.log("No games found to refresh.");
      return;
    }

    for (const g of games) {
      const rid = g.roblox_id;
      if (!rid) continue;
      // Call refresh for each game and wait a short delay to avoid rate limits
      const res = await GameService.refreshRobloxMetadata(String(rid));
      console.log(`Refreshed ${rid}:`, res);
      await new Promise((r) => setTimeout(r, 500));
    }

    console.log("Done refreshing Roblox metadata.");
  } catch (err) {
    console.error("Unhandled error:", err);
    process.exit(1);
  }
}

main();
