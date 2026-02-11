import { Results } from "../components/results";
import { SpecForm } from "../components/specForm";

export function GameFinder() {

    return (
        <div id="main-container" className="flex flex-col md:flex-row min-h-212.5 w-full p-4 gap-4 pt-12">
            <SpecForm />
            <Results />
        </div>
    )
}