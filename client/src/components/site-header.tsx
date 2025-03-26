import { Link } from "wouter";
import { motion } from "framer-motion";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-main bg-cream/90 backdrop-blur-lg shadow-lg">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center">
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
        </nav>
      </div>
    </header>
  );
}