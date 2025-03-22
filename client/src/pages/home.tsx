import { useToast } from "@/hooks/use-toast"; // Ensure this is the correct path
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Filters from "@/components/filters";
import GameCard from "@/components/game-card";
import { Button } from "@/components/ui/button";
import { Dice6 } from "lucide-react";
import { motion } from "framer-motion";
import type { Game, GameFilters } from "@/lib/api-types";
import React from "react";

export default function Home() {
  const { toast } = useToast(); // Ensure useToast is properly imported
  const [filters, setFilters] = useState<GameFilters>({});

  const {
    data: game,
    refetch,
    isLoading,
    error,
  } = useQuery<Game>({
    queryKey: ["/api/games/random", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Construct query parameters based on filters
      if (filters.genres) params.set("genres", JSON.stringify(filters.genres));
      if (filters.minRating) params.set("minRating", filters.minRating.toString());
      if (filters.minReviews) params.set("minReviews", filters.minReviews.toString());
      
      // Handle dates parameter
      if (filters.dates) {
        try {
          // The dates param needs to be in the format YYYY-MM-DD,YYYY-MM-DD
          const dateRegex = /^\d{4}-\d{2}-\d{2},\d{4}-\d{2}-\d{2}$/;
          if (dateRegex.test(filters.dates)) {
            params.set("dates", filters.dates);
            console.log("Setting dates parameter:", filters.dates);
          } else {
            console.error("Invalid date format:", filters.dates);
            params.set("dates", "2015-01-01,2025-12-31");
          }
        } catch (error) {
          console.error("Error handling dates parameter:", error);
          params.set("dates", "2015-01-01,2025-12-31");
        }
      }
      
      if (filters.independentOnly) params.set("independentOnly", filters.independentOnly.toString());

      const response = await fetch(`/api/games/random?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch random game");
      }
      return response.json();
    },
    enabled: false,
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch random game. Please try again.",
      });
    }
  }, [error, toast]);

  const handleRandomize = () => {
    refetch();
  };

  // Reference to the dice icon
  const diceRef = React.useRef<HTMLDivElement>(null);

  // Function to trigger dice animation
  const animateDice = () => {
    if (!isLoading && diceRef.current) {
      const element = diceRef.current;
      element.style.transition = "transform 0.5s ease";
      element.style.transform = "rotate(360deg)";
      
      setTimeout(() => {
        element.style.transition = "transform 0s";
        element.style.transform = "rotate(0deg)";
      }, 500);
    }
  };

  const handleFilterChange = (newFilters: GameFilters) => {
    console.log("New filters:", newFilters);
    setFilters(newFilters);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto text-center mb-12 px-4 pt-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-5xl font-bold text-accent">
            Find Your Next Indie Game
          </h1>
          <p className="text-xl text-additional">
            Discover hidden gems in the indie game world
          </p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-[300px,1fr] gap-8 px-4 -mt-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-cream/50 p-6 rounded-lg shadow-lg -mt-12"
        >
          <Filters onFilterChange={handleFilterChange} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <Button
            size="lg"
            onClick={() => {
              handleRandomize();
              animateDice();
            }}
            disabled={isLoading}
            className="w-full bg-accent hover:bg-additional text-cream transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-lg overflow-hidden relative"
          >
            <div className="flex items-center justify-center">
              <div 
                ref={diceRef}
                className={`mr-2 ${isLoading ? 'animate-spin' : ''}`}
              >
                <Dice6 className="h-6 w-6 text-cream" />
              </div>
              <span>{isLoading ? "Finding a game..." : "Find Random Game"}</span>
            </div>
          </Button>

          {game && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.4,
                type: "spring",
                stiffness: 100 
              }}
              className="bg-cream/50 rounded-lg shadow-lg overflow-hidden"
            >
              <GameCard game={game} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}