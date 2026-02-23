import { useState } from "react";
import { Results } from "../components/results";
import { SpecForm } from "../components/specForm";

export function GameFinder() {

    const [searchResults, setSearchResults] = useState([]);
    return (
        <div id="main-container" className="flex flex-col md:flex-row min-h-212.5 w-full p-4 gap-4 pt-12">
            <SpecForm setResults={setSearchResults}/>
            <Results results={searchResults}/>
        </div>
    )
}