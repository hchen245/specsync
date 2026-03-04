import { Link } from 'react-router-dom';
export function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-black px-4 py-2 flex gap-6">
            <Link to="/" className="text-white hover:bg-gray-700 px-3 py-1 rounded-sm font-bold">
                SpecSync
            </Link>
            <Link to="/find-games" className="text-white hover:bg-gray-700 px-3 py-1 rounded-sm font-bold">
                Find a game
            </Link>
            <Link to="/how-to-find" className="text-white hover:bg-gray-700 px-3 py-1 rounded-sm font-bold">
                How to find specs?
            </Link>
        </nav>

    )
}