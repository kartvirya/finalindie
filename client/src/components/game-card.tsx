import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, CalendarDays, Share2, Users } from "lucide-react";
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
      whileHover={{ scale: 1.02 }}
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
              <div className="absolute inset-0 bg-gradient-to-t from-accent/90 via-accent/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-xl md:text-2xl font-bold text-cream mb-3 line-clamp-2 drop-shadow-lg">
                  {game.name}
                </h2>
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                  <Badge variant="secondary" className="flex items-center gap-1 bg-additional text-cream shadow-sm">
                    <Star className="h-3 w-3 md:h-4 md:w-4 text-main animate-pulse" />
                    {Math.round(game.rating * 10) / 10}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1 bg-additional text-cream shadow-sm">
                    <Users className="h-3 w-3 md:h-4 md:w-4" />
                    {game.ratings_count.toLocaleString()}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1 bg-additional text-cream shadow-sm">
                    <CalendarDays className="h-3 w-3 md:h-4 md:w-4" />
                    {new Date(game.released).getFullYear()}
                  </Badge>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {game.genres.slice(0, 3).map((genre) => (
                    <Badge
                      key={genre.id}
                      variant="outline"
                      className="bg-main/50 text-accent border-accent/20 hover:bg-accent hover:text-cream transition-colors duration-200 shadow-sm"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                  {game.genres.length > 3 && (
                    <Badge variant="outline" className="bg-main/50 text-accent shadow-sm">
                      +{game.genres.length - 3} more
                    </Badge>
                  )}
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-main/30 hover:bg-accent hover:text-cream rounded-full w-8 h-8 p-0 flex items-center justify-center shadow-md hover:shadow-lg"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
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