import { Link } from "wouter";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-main bg-cream/90 backdrop-blur-lg shadow-lg">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center hover:opacity-90 transition-all duration-300 group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="h-8 flex items-center"
              >
                <img
                  src="/images/logo.png"
                  alt="Indie Game Randomizer"
                  className="h-full w-auto"
                />
              </motion.div>
            </a>
          </Link>

          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                className="bg-main/30 text-accent hover:bg-accent hover:text-cream transition-all duration-200 rounded-full"
                onClick={() => window.open('https://github.com/yourusername/indie-game-randomizer', '_blank')}
              >
                <Github className="h-5 w-5 mr-2" />
                Star on GitHub
              </Button>
            </motion.div>
          </div>
        </nav>
      </div>
    </header>
  );
}