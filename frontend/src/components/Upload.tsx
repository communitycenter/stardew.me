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
import FarmerView from "./FarmerView";
import { useAvatarContext } from "@/lib/AvatarContext";
import { useUploadContext } from "@/lib/UploadContext";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { GetStaticProps } from "next";

export default function Upload() {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(
    null
  ) as MutableRefObject<HTMLButtonElement>;
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();
  const [background, setBackground] = useState<string | null>(null);
  const { isAvatar, setIsAvatar } = useAvatarContext();
  const { selectedFile, setSelectedFile } = useUploadContext();
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    console.log(selectedPlayer);

    if (!selectedPlayer) return;

    selectedPlayer["background"] = background as "day" | "night" | null;

    async function getAvatar() {
      const req = await fetch("http://localhost:8000/avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPlayer),
      });

      const res = await req.json();

      if (!res.success)
        return toast({
          variant: "destructive",
          title: "Error generating avatar",
          description:
            "Something went wrong on our backend! Please join our Discord & let us know <3",
        });

      console.log(res);
      localStorage.setItem("avatarUrl", res.url);
      {
        /* localstorage for now */
      }
      localStorage.setItem("playerInfo", JSON.stringify(selectedPlayer));
      setIsAvatar(true);
    }

    getAvatar();
    setSelectedPlayer(undefined);
    setBackground(null);
    // make a post request to localhost:8000 with the body and console log the response
  }, [selectedPlayer, background]);

  useEffect(() => {
    if (recent.length > 0) return;

    async function getRecent() {
      try {
        const res = await fetch("http://localhost:8000/recent");
        const data = await res.json();
        console.log(data);
        setRecent(data.recent);
      } catch (error) {
        console.error("Error fetching recent data:", error);
      }
    }

    getRecent();
  }, [recent]); // <-- Empty dependency array to run the effect only once

  const handleChange = async () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = async (event) => {
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

      reader.readAsText(selectedFile);
    }
  };

  if (isAvatar) {
    return <FarmerView />;
  } else {
    return (
      <>
        <Dialog>
          <DialogTrigger ref={inputRef} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select a Farmhand</DialogTitle>
              <div className="gap-1">
                {players.map((player) => {
                  return (
                    <div
                      key={player.name}
                      onClick={() => {
                        setSelectedPlayer(player);
                        inputRef?.current?.click();
                      }}
                      className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors rounded-md cursor-pointer"
                    >
                      <button key={player.name} className="p-3 flex">
                        <Skeleton>
                          <img
                            src="../assets/sprite.png"
                            alt=""
                            className="w-16 h-16 rounded-md"
                          />
                        </Skeleton>

                        <div className="py-5">
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 ml-4">
                            {player.name}
                          </p>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <div className="mt-48 mx-auto max-w-2xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-white dark:bg-neutral-950 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-neutral-800 transition ease-in-out duration-150">
              <div className="flex flex-col items-center justify-center pt-6 pb-6">
                <p className="mb-2 text-sm text-gray-500 dark:text-white">
                  {selectedFile
                    ? "Uploaded file: " + selectedFile.name
                    : "Drag a Stardew Valley save file here, or click to upload"}
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSelectedFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </label>
          </div>
          <div className="flex gap-4 justify-center mt-4 h-9 disabled">
            <BackgroundSelect value={background} setValue={setBackground} />
            <div onClick={handleChange}>
              <Button className="disabled:opacity-0">Generate Farmer</Button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-center mt-16 mb-4">
            Recently Generated
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {recent.length === 0 ? (
              // Skeleton loading effect when recent.length is 0
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-solid"></div>
            ) : (
              // Render the images when recent.length is greater than 0
              recent.map((url, index) => (
                <div key={url}>
                  <img src={url} className={`h-24 rounded-md`} alt="Recent" />
                </div>
              ))
            )}
          </div>
        </div>
      </>
    );
  }
}
