import { useToast } from "@/hooks/use-toast"; // Ensure this is the correct path
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Filters from "@/components/filters";
import GameCard from "@/components/game-card";
import { Button } from "@/components/ui/button";
import { Dice6, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Game, GameFilters } from "@/lib/api-types";
import React from "react";

export default function Home() {
  const { toast } = useToast(); // Ensure useToast is properly imported
  const [filters, setFilters] = useState<GameFilters>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    <div className="min-h-screen bg-[#e6f7f7]">
      <div className="container mx-auto px-4 py-4">
        {/* Header Section */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-[#2d3436] mb-2">
              Find Your Next Indie Game
            </h1>
            <p className="text-sm md:text-base text-[#2d3436]/80 mb-4">
              Discover hidden gems in the indie game world
            </p>
          </motion.div>

          <div className="flex items-center gap-2 max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1"
            >
              <Button
                size="default"
                onClick={() => {
                  handleRandomize();
                  animateDice();
                }}
                disabled={isLoading}
                className="w-full bg-[#2d3436] hover:bg-[#2d3436]/90 text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-xl overflow-hidden py-3 relative group"
              >
                <div className="flex items-center justify-center">
                  <div 
                    ref={diceRef}
                    className={`mr-2 group-hover:rotate-180 transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`}
                  >
                    <Dice6 className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm md:text-base font-medium">
                    {isLoading ? "Finding..." : "Find Random Game"}
                  </span>
                </div>
              </Button>
            </motion.div>

            <Button
              size="default"
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-white hover:bg-white/90 shadow-md hover:shadow-lg transition-all duration-300 py-3 px-3 rounded-xl"
            >
              {isFilterOpen ? (
                <X className="h-5 w-5 text-[#2d3436]" />
              ) : (
                <SlidersHorizontal className="h-5 w-5 text-[#2d3436]" />
              )}
            </Button>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="relative">
          {/* Filters Panel - Mobile */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden mb-4"
              >
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="space-y-1 mb-3">
                    <h2 className="text-base font-semibold text-[#2d3436]">Game Filters</h2>
                    <p className="text-sm text-[#2d3436]/70">Customize your discovery</p>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <Filters onFilterChange={handleFilterChange} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Layout */}
          <div className="hidden lg:flex gap-6 items-start">
            {/* Filters Panel - Desktop */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "300px" }}
                  exit={{ opacity: 0, x: -20, width: 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0"
                >
                  <div className="bg-white rounded-xl shadow-md p-4 sticky top-20">
                    <div className="space-y-1 mb-3">
                      <h2 className="text-lg font-semibold text-[#2d3436]">Game Filters</h2>
                      <p className="text-sm text-[#2d3436]/70">Customize your discovery</p>
                    </div>
                    <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 custom-scrollbar">
                      <Filters onFilterChange={handleFilterChange} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Game Results */}
            <div className={`flex-1 transition-all duration-300 ${isFilterOpen ? 'lg:ml-0' : ''}`}>
              {game && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100 
                  }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <GameCard game={game} />
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile Game Results */}
          <div className="lg:hidden">
            {game && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 100 
                }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <GameCard game={game} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}