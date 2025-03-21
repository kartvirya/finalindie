import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Gamepad2, Star, Users, Calendar } from "lucide-react";
import type { Genre, GameFilters } from "@/lib/api-types";

interface FiltersProps {
  onFilterChange: (filters: GameFilters) => void;
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [rating, setRating] = useState([30]);
  const [reviews, setReviews] = useState([0]);
  const [releaseYear, setReleaseYear] = useState([2015]);
  

  const { data: genres, isLoading } = useQuery<Genre[]>({
    queryKey: ["/api/genres"],
  });
  
  const maxYear = 2025; // Explicitly set max year to 2025

  const handleGenreToggle = (genreSlug: string) => {
    // Skip the "indie" genre as it's always applied
    if (genreSlug === "indie") return;
    
    const newGenres = selectedGenres.includes(genreSlug)
      ? selectedGenres.filter((g) => g !== genreSlug)
      : [...selectedGenres, genreSlug];

    setSelectedGenres(newGenres);
    updateFilters(newGenres, rating[0], reviews[0], releaseYear[0]);
  };

  const handleRatingChange = (newRating: number[]) => {
    setRating(newRating);
    updateFilters(selectedGenres, newRating[0], reviews[0], releaseYear[0]);
  };

  const handleReviewsChange = (newReviews: number[]) => {
    setReviews(newReviews);
    updateFilters(selectedGenres, rating[0], newReviews[0], releaseYear[0]);
  };

  const handleReleaseYearChange = (newYear: number[]) => {
    const year = Math.min(newYear[0], maxYear); // Ensure year doesn't exceed maxYear
    setReleaseYear([year]);
    updateFilters(selectedGenres, rating[0], reviews[0], year);
  };

  const updateFilters = (
    genres: string[],
    minRating: number,
    minReviews: number,
    selectedYear: number
  ) => {
    // Always include "indie" genre and set independentOnly to true
    const allGenres = genres.includes("indie") ? genres : [...genres, "indie"];
    
    // Format dates in YYYY-MM-DD,YYYY-MM-DD format as required by the API
    // Use padded months and days to ensure format is correct
    const startDate = `${selectedYear}-01-01`;
    const endDate = `${maxYear}-12-31`;
    
    // Validate the date format (should be YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      console.error("Invalid date format. Dates should be in YYYY-MM-DD format.");
      return;
    }
    
    const dateRange = `${startDate},${endDate}`;
    console.log("Using date range:", dateRange);
    
    const filters: GameFilters = {
      genres: allGenres.length > 0 ? allGenres : ["indie"],
      independentOnly: true,
      dates: dateRange
    };
    
    if (minRating > 0) filters.minRating = minRating;
    if (minReviews > 0) filters.minReviews = minReviews;
  
    console.log("Applying filters:", filters);
    onFilterChange(filters);
  };

  const badgeVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  };

  useEffect(() => {
    // Apply default filters when component mounts
    setSelectedGenres([]);
    setRating([30]);
    setReviews([0]);
    setReleaseYear([2015]);
    updateFilters([], 30, 0, 2015);
  }, []);

  return (
    <Card className="sticky top-4 backdrop-blur-sm bg-card/80 border-primary/20">
      <CardHeader className="space-y-2">
        <div className="flex items-center space-x-2">
          <Gamepad2 className="h-5 w-5 text-primary" />
          <CardTitle>Game Filters</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Customize your indie game discovery
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            Additional Genres
            {selectedGenres.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedGenres.length} selected
              </Badge>
            )}
          </h3>
          <div className="flex flex-wrap gap-2">
            {isLoading ? (
              <div className="text-sm text-muted-foreground animate-pulse">
                Loading genres...
              </div>
            ) : (
              genres?.filter(genre => genre.slug !== "indie").map((genre, index) => (
                <motion.div
                  key={genre.id}
                  variants={badgeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: index * 0.05 }}
                >
                  <Badge
                    variant={selectedGenres.includes(genre.slug) ? "default" : "outline"}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handleGenreToggle(genre.slug)}
                  >
                    {genre.name}
                  </Badge>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Star className="h-4 w-4" /> Minimum Rating
          </h3>
          <Slider
            value={rating}
            onValueChange={handleRatingChange}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="text-sm text-muted-foreground">
            {rating[0]}% or higher
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Users className="h-4 w-4" /> Minimum Reviews
          </h3>
          <Slider
            value={reviews}
            onValueChange={handleReviewsChange}
            max={500}
            step={10}
            className="w-full"
          />
          <div className="text-sm text-muted-foreground">
            {reviews[0]}+ reviews
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Release Year (and newer)
          </h3>
          <Slider
            value={releaseYear}
            onValueChange={handleReleaseYearChange}
            min={2000}
            max={maxYear} // Use maxYear instead of currentYear
            step={1}
            className="w-full"
          />
          <div className="text-sm text-muted-foreground">
            {releaseYear[0]} or newer
          </div>
        </div>
      </CardContent>
    </Card>
  );
}