import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom';


export function Home() {
    return (
        <div className="flex flex-col items-center">
        <h1 className="text-white pt-12 text-center mb-5">Home page</h1>
        <Button className="w-30 h-15" asChild>
            <Link to="/find-games">Find a game</Link>
        </Button>
        </div>

    )
}