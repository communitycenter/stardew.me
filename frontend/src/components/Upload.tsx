// @eslint-ignore next/next/no-img-element

import {
  ChangeEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import BackgroundSelect from "./BackgroundSelect";
import GenerateButton from "./GenerateButton";
import { parseSaveFile } from "../../utils/parse";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Player } from "../../utils/types/player.types";
import { Skeleton } from "./ui/skeleton";

export default function Upload() {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(
    null
  ) as MutableRefObject<HTMLButtonElement>;
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();

  useEffect(() => {
    console.log(selectedPlayer);

    if (!selectedPlayer) return;

    async function getAvatar() {
      const req = await fetch("http://localhost:8000/generate_image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPlayer),
      });

      const res = await req.json();
      console.log(res);
    }

    getAvatar();
    // make a post request to localhost:8000 with the body and console log the response
  }, [selectedPlayer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target!.files![0];

    const reader = new FileReader();

    reader.onload = async function (event) {
      try {
        // Now we can begin parsing the save file
        let players: Player[] = [];
        // searches for all players in the save file and returns an array
        // objects are unprocessed and will be used to parse each player's data
        const data = await parseSaveFile(event.target?.result as string);

        data.forEach((player) => {
          players.push(player);
        });

        setPlayers(players);

        if (players.length > 1) {
          inputRef?.current?.click();
        } else {
          setSelectedPlayer(players[0]);
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error Parsing File",
          description: err instanceof Error ? err.message : "Unknown error.",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger ref={inputRef} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            <div className="gap-1">
              <div className="dark:hover:bg-neutral-800 transition-colors rounded-md">
                {players.map((player) => {
                  return (
                    <button
                      key={player.name}
                      className="p-3 flex"
                      onClick={() => {
                        setSelectedPlayer(player);
                        inputRef?.current?.click();
                      }}
                    >
                      <Skeleton>
                        <img
                          src="../assets/sprite.png"
                          alt=""
                          className="w-16 h-16 rounded-md"
                        />
                      </Skeleton>

                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 ml-4 mt-3">
                        {player.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="mt-48 mx-auto max-w-2xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-white dark:bg-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition ease-in-out duration-150">
            <div className="flex flex-col items-center justify-center pt-6 pb-6">
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                Drag a Stardew Valley save file here, or click to upload
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
            />
          </label>
        </div>
        <div className="flex gap-4 justify-center mt-4 h-9">
          <BackgroundSelect />
          <GenerateButton />
        </div>
      </div>
    </>
  );
}
