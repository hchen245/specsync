import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, Gamepad2, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen pt-24 bg-linear-to-b from-black via-zinc-900 to-black text-white flex flex-col items-center">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 px-6 pb-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl md:text-7xl font-bold tracking-tight"
        >
          SpecSync
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 max-w-2xl text-zinc-400 text-lg md:text-xl"
        >
          Instantly discover games that run on your PC. Just enter your specs and find your next game.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-10"
        >
          <Button
            asChild
            className="w-44 h-14 bg-[oklch(0.63_0.17_149)] text-white hover:bg-[oklch(0.58_0.17_149)]! transition-colors duration-200 text-md"
          >
            <Link to="/find-games">Find a Game</Link>
          </Button>

         <Button
         
            asChild
            className="w-44 h-14 bg-[oklch(0.63_0.17_149)] text-white hover:bg-[oklch(0.58_0.17_149)]! transition-colors duration-200 text-sm"
          >
            <Link to="/how-to-find">How to Find Specs?</Link>
          </Button>

        </motion.div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-6xl px-6 pb-20 grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Cpu size={36} />}
          title="Enter Your Specs"
          description="Quickly input your CPU, GPU, and etc to get tailored recommendations."
        />
        <FeatureCard
          icon={<Search size={36} />}
          title="Smart Matching"
          description="Our system filters games based on performance requirements."
        />
        <FeatureCard
          icon={<Gamepad2 size={36} />}
          title="Play Confidently"
          description="Download and play knowing your system can handle it smoothly."
        />
      </div>

      {/* Footer */}
      <div className="w-full border-t border-zinc-800 py-6 text-center text-zinc-500 text-sm">
        © {new Date().getFullYear()} SpecSync — Built for gamers.
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-xl flex flex-col items-center text-center"
    >
      <div className="mb-4 text-[oklch(0.63_0.17_149)]">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}


