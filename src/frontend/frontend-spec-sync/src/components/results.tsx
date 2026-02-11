import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import {
  Card,
  CardContent,

} from "@/components/ui/card"
export function Results() {

const results = [
  { game: "Game 1", info: "game 1 info" },
  { game: "Game 2", info: "game 2 info" },
  { game: "Game 3", info: "game 3 info" },
  { game: "Game 4", info: "game 4 info" },
  { game: "Game 5", info: "game 5 info" },
  { game: "Game 6", info: "game 6 info" },
  { game: "Game 7", info: "game 7 info" },
  { game: "Game 8", info: "game 8 info" },
  { game: "Game 9", info: "game 9 info" },
  { game: "Game 10", info: "game 10 info" },
  { game: "Game 11", info: "game 11 info" },
  { game: "Game 12", info: "game 12 info" },
  { game: "Game 13", info: "game 13 info" },
  { game: "Game 14", info: "game 14 info" },
  { game: "Game 15", info: "game 15 info" },
  { game: "Game 16", info: "game 16 info" },
  { game: "Game 17", info: "game 17 info" },
  { game: "Game 18", info: "game 18 info" },
  { game: "Game 19", info: "game 19 info" },
  { game: "Game 20", info: "game 20 info" },
];


    return (
    <Card id="right-side" className="text-white w-full h-200 md:w-[70%] border-neutral-800 bg-black border-2 rounded-md p-4 overflow-auto">
      <CardContent className="flex flex-col gap-3 overflow-auto">
        {results.map((result) => (
          <Item className="bg-neutral-900">
            <ItemContent>
              <ItemTitle>{result.game}</ItemTitle>
              <ItemDescription>
                {result.info}
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </CardContent>

      </Card>
    )
}