import { GameFinder } from "./pages/gameFinder";
import { Home } from "./pages/home";
import { HowToFind } from "./pages/howToFind";
import { Navbar } from "./components/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


export function App() {

  // const [results, setResults] = useState();
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">

      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-games" element={<GameFinder />} />
          <Route path="/how-to-find" element={<HowToFind />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
