import {
  Item,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item"
import {
  Card,
  CardContent,


} from "@/components/ui/card"

export interface SearchResult {
  name: string
  note: string
  score: number
  cosine_similarity: number
}

interface ResultsProps {
  results: SearchResult[]
}

export function Results({ results }: ResultsProps) {

    return (
<Card
  id="right-side"
  className="text-white w-full h-200 md:w-[70%] border-neutral-800 bg-black border-2 rounded-md p-4 overflow-auto"
>
  <CardContent className="flex flex-col gap-3">
    {results.map((result: SearchResult, index: number) => (
      <Item
        key={result.name + String(index)}
        className="bg-neutral-900 border border-neutral-800 rounded-md p-4 hover:border-neutral-600 transition"
      >
        <ItemContent className="flex flex-col gap-3">
          
          {/* Top Row */}
          <div className="flex justify-between items-center">
            <ItemTitle className="text-lg font-semibold">
              {result.name}
            </ItemTitle>

            <span className="text-sm border border-neutral-700 px-2 py-1 rounded-md text-neutral-300">
              {result.note}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-neutral-800" />

          {/* Stats */}
          <div className="flex justify-between text-sm text-neutral-400">
            <span>Compatibility Score</span>
            <span className="text-white font-medium">
              {result.score.toFixed(1)}%
            </span>
          </div>

          <div className="flex justify-between text-sm text-neutral-400">
            <span>Cosine Similarity</span>
            <span className="text-white font-medium">
              {result.cosine_similarity.toFixed(4)}
            </span>
          </div>

        </ItemContent>
      </Item>
    ))}
  </CardContent>
</Card>
    )
}