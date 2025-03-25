import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, CalendarDays, Share2, Users, Gamepad2, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Game } from "@/lib/api-types";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const { toast } = useToast();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.share({
        title: game.name,
        text: `Check out this indie game: ${game.name}`,
        url: window.location.origin + `/game/${game.id}`
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.origin + `/game/${game.id}`);
      toast({
        title: "Link copied! 🎮",
        description: "Game link has been copied to your clipboard.",
        duration: 2000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group relative"
    >
      <Link href={`/game/${game.id}`}>
        <a className="block focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-lg">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border-2 border-main hover:border-accent bg-cream/80 rounded-lg transform hover:-translate-y-1">
            <div className="aspect-video relative overflow-hidden">
              <motion.img
                src={game.background_image}
                alt={game.name}
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-accent/90 via-accent/50 to-transparent"
                whileHover={{
                  opacity: [1, 0.8, 1],
                  transition: { duration: 1, repeat: Infinity }
                }}
              />
              
              {/* Play button animation */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                <motion.div
                  className="bg-cream/90 rounded-full p-3 shadow-lg"
                  whileHover={{ 
                    scale: 1.2,
                    boxShadow: "0 0 15px rgba(255,255,255,0.8)" 
                  }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    boxShadow: ["0 0 5px rgba(255,255,255,0.3)", "0 0 20px rgba(255,255,255,0.7)", "0 0 5px rgba(255,255,255,0.3)"],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                >
                  <Play className="h-8 w-8 text-accent fill-accent" />
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="absolute top-4 right-4"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                >
                  <Gamepad2 className="h-6 w-6 text-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </motion.div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-accent to-transparent pt-8">
                <motion.h2 
                  className="text-base sm:text-xl md:text-2xl font-bold text-cream mb-2 line-clamp-2 drop-shadow-lg"
                  whileHover={{
                    textShadow: "0 0 8px rgba(255,255,255,0.5)"
                  }}
                >
                  {game.name}
                </motion.h2>
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-wrap">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1 bg-additional text-cream shadow-sm text-xs sm:text-sm">
                      <Star className="h-3 w-3 text-main animate-pulse" />
                      {Math.round(game.rating * 10) / 10}
                    </Badge>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1 bg-additional text-cream shadow-sm text-xs sm:text-sm">
                      <Users className="h-3 w-3" />
                      {game.ratings_count.toLocaleString()}
                    </Badge>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1 bg-additional text-cream shadow-sm text-xs sm:text-sm">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(game.released).getFullYear()}
                    </Badge>
                  </motion.div>
                </div>
              </div>
            </div>
            <CardContent className="p-3 sm:p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {game.genres.slice(0, 2).map((genre, index) => (
                    <motion.div
                      key={genre.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge
                        variant="outline"
                        className="bg-main/50 text-accent border-accent/20 hover:bg-accent hover:text-cream transition-colors duration-200 shadow-sm text-xs sm:text-sm"
                      >
                        {genre.name}
                      </Badge>
                    </motion.div>
                  ))}
                  {game.genres.length > 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge variant="outline" className="bg-main/50 text-accent shadow-sm text-xs sm:text-sm">
                        +{game.genres.length - 2} more
                      </Badge>
                    </motion.div>
                  )}
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="ml-1 sm:ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-main/30 hover:bg-accent hover:text-cream rounded-full w-7 h-7 sm:w-8 sm:h-8 p-0 flex items-center justify-center shadow-md hover:shadow-lg"
                    onClick={handleShare}
                  >
                    <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </a>
      </Link>
    </motion.div>
  );
}