import React from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useAvatarContext } from "../lib/AvatarContext";
import { useToast } from "./ui/use-toast";

export default function FarmerView() {
  const avatarUrl = localStorage.getItem("avatarUrl");
  const playerInfo = localStorage.getItem("playerInfo");
  const { isAvatar, setIsAvatar } = useAvatarContext();

  const downloadImage = () => {
    if (avatarUrl) {
      // Create a link element
      const link = document.createElement("a");
      link.href = avatarUrl;
      link.download = "avatar_image.png"; // Specify the filename for the downloaded image
      document.body.appendChild(link);

      // Simulate a click on the link to trigger the download
      link.click();

      // Clean up and remove the link from the DOM
      document.body.removeChild(link);
    }
  };

  const resetAvatar = () => {
    setIsAvatar(false);
    localStorage.removeItem("avatarUrl");
    localStorage.removeItem("playerInfo");
  };

  const { toast } = useToast();

  return (
    <div>
      <div className="hidden sm:flex mx-auto max-w-2xl w-full">
        <div className="mt-48 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center w-full">
            <div className="flex flex-col items-center justify-center w-48 h-80 rounded-lg bg-white dark:bg-neutral-950 dark:border-gray-600">
              <div className="flex flex-col items-center justify-center pt-6 pb-6">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <img
                    src={avatarUrl ? avatarUrl : "default-placeholder.jpg"}
                    alt="Avatar"
                    className="rounded-lg"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-48">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Here&apos;s your farmer!
          </h1>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button onClick={downloadImage}>Download</Button>
            <Button onClick={resetAvatar}>New Farmer</Button>
          </div>
        </div>
      </div>
      <div className="block sm:hidden mx-auto max-w-2xl w-full px-4">
        <div className="mt-16">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Here&apos;s your farmer!
          </h1>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button onClick={downloadImage}>Download</Button>
            <Button onClick={resetAvatar}>New Farmer</Button>
          </div>
        </div>
        <div className="mt-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center w-full">
            <div className="flex flex-col items-center justify-center w-48 h-80 rounded-lg bg-white dark:bg-neutral-950 dark:border-gray-600">
              <div className="flex flex-col items-center justify-center pt-6 pb-6">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <img
                    src={avatarUrl ? avatarUrl : "default-placeholder.jpg"}
                    alt="Avatar"
                    className="rounded-lg"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <Accordion type="single" collapsible>
          <AccordionItem
            value="item-1"
            className="border-gray-300 dark:border-gray-700"
          >
            <AccordionTrigger>Expert Mode</AccordionTrigger>
            <AccordionContent>
              <>
                {playerInfo ? (
                  <div className="mt-4 relative h-64">
                    <div className="bg-[#0F111A] h-full rounded-lg p-3 overflow-scroll">
                      <p className="text-gray-100">
                        <pre>
                          <code>
                            {JSON.stringify(JSON.parse(playerInfo), null, 4)}
                          </code>
                        </pre>
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        window.navigator.clipboard.writeText(playerInfo);
                        toast({
                          variant: "default",
                          title: "Copied!",
                        });
                      }}
                      className="absolute right-4 bottom-4 py-1.5 px-3 bg-[#0a0a0a] border border-zinc-300 dark:border-zinc-800 rounded-md hover:bg-zinc-900 transition-colors duration-150"
                    >
                      Copy
                    </button>
                  </div>
                ) : (
                  <div className="relative mt-4 bg-[#0F111A] h-64 rounded-lg p-2 overflow-scroll flex items-center justify-center text-gray-400">
                    No player info found.
                  </div>
                )}
              </>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
