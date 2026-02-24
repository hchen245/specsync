import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom';


export function Home() {
    return (
        <div className="flex flex-col items-center">
            <h1 className="text-white pt-25 pb-12 text-center mb-5 text-6xl font-semibold">SpecSync</h1>
            <div className="flex gap-4">
                <Button className="w-30 h-13 bg-[oklch(0.63_0.17_149)] text-white" asChild>
                    <Link to="/find-games">Find a game</Link>
                </Button>
                <Button className="w-40 h-13 bg-[oklch(0.63_0.17_149)] text-white" asChild>
                    <Link to="/how-to-find">How to find specs?</Link>
                </Button>
            </div>
        </div>

    )
}