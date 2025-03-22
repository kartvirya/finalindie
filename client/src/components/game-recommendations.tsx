import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircle, Gamepad2 } from "lucide-react";
import GameCard from "./game-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { Game } from "@/lib/api-types";

interface RecommendationResponse {
  results: Game[];
  similarityFactors: {
    genres: string[];
    tags: string[];
    developers: string[];
  };
}

interface GameRecommendationsProps {
  gameId: string;
}

export default function GameRecommendations({ gameId }: GameRecommendationsProps) {
  const { data, isLoading, error } = useQuery<RecommendationResponse>({
    queryKey: [`/api/games/${gameId}/recommendations`],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-main/50" />
          <Skeleton className="h-4 w-96 bg-main/30" />
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video w-full bg-main/50" />
              <Skeleton className="h-4 w-3/4 bg-main/30" />
              <Skeleton className="h-4 w-1/2 bg-main/30" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="bg-accent/10 text-accent border-2 border-accent/20">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load recommendations. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data?.results.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-cream/80 p-6 rounded-lg border-2 border-main">
        <div className="flex items-center gap-3 mb-3">
          <Gamepad2 className="h-6 w-6 text-accent animate-bounce" />
          <h2 className="text-2xl font-bold text-accent">Similar Games You Might Like</h2>
        </div>
        <p className="text-additional">
          Based on {data.similarityFactors.genres.join(", ")} games
          {data.similarityFactors.developers.length > 0 && 
            ` from ${data.similarityFactors.developers.join(", ")}`}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {data.results.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.2,
              type: "spring",
              stiffness: 100
            }}
          >
            <GameCard game={game} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}