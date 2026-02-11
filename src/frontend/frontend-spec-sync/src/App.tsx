import { GameFinder } from "./pages/gameFinder";
import { Home } from "./pages/home";
import { Navbar } from "./components/navbar";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";


export function App() {

  // const [results, setResults] = useState();
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">

    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/find-games" element={<GameFinder />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
