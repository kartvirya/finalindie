import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Star, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GameRecommendations from "@/components/game-recommendations";
import type { Game } from "@/lib/api-types";

export default function GameDetails() {
  const [, params] = useRoute("/game/:id");
  const { toast } = useToast();

  const { data: game, isLoading } = useQuery<Game>({
    queryKey: [`/api/games/${params?.id}`],
  });

  const handleShare = async () => {
    try {
      await navigator.share({
        title: game?.name || "Indie Game",
        text: `Check out this indie game: ${game?.name}`,
        url: window.location.href
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Game link has been copied to your clipboard."
      });
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center">
          <div className="h-10 w-24 bg-main/50 rounded-full" />
          <div className="h-10 w-24 bg-main/50 rounded-full" />
        </div>
        <div className="h-[400px] bg-main/30 rounded-xl shadow-lg" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-accent mb-4">Game Not Found</h2>
          <p className="text-additional mb-8">This game might have been removed or is no longer available.</p>
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="bg-main/30 text-accent hover:bg-accent hover:text-cream transition-all duration-200 rounded-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="text-accent hover:text-additional hover:bg-main/50 transition-colors duration-200 rounded-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="ghost" 
            onClick={handleShare}
            className="bg-main/30 text-accent hover:bg-accent hover:text-cream transition-all duration-200 flex items-center gap-2 px-6 py-2 rounded-full shadow-md hover:shadow-lg"
          >
            <Share2 className="h-4 w-4" /> Share Game
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <Card className="overflow-hidden border-2 border-main hover:border-accent transition-colors duration-300 bg-cream/80 rounded-xl shadow-lg">
          <div className="aspect-[21/9] sm:aspect-[2/1] md:aspect-video relative overflow-hidden">
            <motion.img
              src={game.background_image}
              alt={game.name}
              className="object-cover w-full h-full"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-accent/90 via-accent/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-cream drop-shadow-lg mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {game.name}
              </motion.h1>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Badge variant="secondary" className="flex items-center gap-2 bg-additional text-cream text-sm md:text-base shadow-md">
                  <Star className="h-4 w-4 text-main animate-pulse" />
                  Rating: {Math.round(game.rating * 10) / 10}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-2 bg-additional text-cream text-sm md:text-base shadow-md">
                  <Calendar className="h-4 w-4" />
                  Released: {new Date(game.released).toLocaleDateString()}
                </Badge>
                {game.metacritic && (
                  <Badge variant="secondary" className="flex items-center gap-2 bg-additional text-cream text-sm md:text-base shadow-md">
                    <Award className="h-4 w-4" />
                    Metacritic: {game.metacritic}
                  </Badge>
                )}
              </motion.div>
            </div>
          </div>

          <CardContent className="space-y-8 p-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-main/20 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-accent">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <Badge 
                    key={genre.id} 
                    className="bg-main/50 text-accent border-accent/20 hover:bg-accent hover:text-cream transition-colors duration-200 text-sm md:text-base shadow-sm"
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-main/20 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-accent">Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {game.platforms.map(({ platform }) => (
                  <Badge 
                    key={platform.id} 
                    variant="outline" 
                    className="border-accent/20 text-accent hover:bg-accent hover:text-cream transition-colors duration-200 text-sm md:text-base shadow-sm"
                  >
                    {platform.name}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {game.description_raw && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-main/20 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-4 text-accent">About</h3>
                <p className="text-additional whitespace-pre-line text-sm md:text-base leading-relaxed">
                  {game.description_raw}
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {params?.id && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <GameRecommendations gameId={params.id} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}