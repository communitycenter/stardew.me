"use client";
// @eslint-ignore next/next/no-img-element

import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { uploadSaveFile } from "@/app/actions";
import { parseSaveFile } from "@/lib/parse";
import { Player } from "@/lib/types/player.types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BorderBeam } from "./magicui/border-beam";
import { motion, AnimatePresence } from "framer-motion";
import Gallery from "./Gallery";

export default function Upload() {
  const [, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "parsing" | "selecting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );

  console.log(generatedImageUrl);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        setUploadStatus("parsing");
        setErrorMessage(null);
        try {
          const parsedPlayers = await parseSaveFile(await file.text());
          setPlayers(parsedPlayers);
          setUploadStatus("selecting");
        } catch (err) {
          console.error("Parse error:", err);
          setUploadStatus("error");
          setErrorMessage("Failed to parse save file");
        }
      }
    },
    maxFiles: 1,
  });

  const handlePlayerSelect = async (player: Player) => {
    setSelectedPlayer(player);
    setUploadStatus("uploading");
    console.log("Selected player data:", player);
    try {
      const result = await uploadSaveFile([player]);
      console.log("API Response:", result);
      if (result.success) {
        setUploadStatus("success");
        setGeneratedImageUrl(result.data.imageUrl);
        console.log("Setting image URL to:", result.data.url);
      } else {
        setUploadStatus("error");
        setErrorMessage(result.error || "Unknown error occurred");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus("error");
      setErrorMessage("Failed to upload file");
    }
  };

  return (
    <div className="mt-8 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        {uploadStatus === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="my-12">
              <div className="text-center">
                <h2 className="text-2xl font-semibold">stardew.me</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Upload your Stardew Valley save & generate your avatar!
                </p>
              </div>
            </div>
            <div className="flex w-full relative overflow-hidden">
              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center w-full h-128 border-2 rounded-lg cursor-pointer transition ease-in-out duration-150
                  ${
                    isDragActive
                      ? "border-primary bg-primary/5 dark:bg-primary/10"
                      : "border-gray-400 dark:border-gray-600 bg-white dark:bg-neutral-950 hover:bg-gray-50 dark:hover:bg-neutral-800"
                  }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center pt-6 pb-6">
                  <p className="mb-2 text-sm text-gray-500 dark:text-white">
                    {isDragActive
                      ? "Drop the file here"
                      : "Drag & drop a Stardew Valley save file here, or click to select"}
                  </p>
                  <BorderBeam
                    duration={6}
                    size={100}
                    className="from-transparent via-red-500 to-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="mt-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-semibold mb-8">Recent Farmhands</h2>
              <Gallery />
            </div>
          </motion.div>
        )}

        {uploadStatus === "parsing" && (
          <motion.div
            key="parsing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="rounded-full h-8 w-8 border-t-2 border-primary border-solid"
            ></motion.div>
            <p className="text-gray-500 dark:text-gray-400">
              Parsing save file...
            </p>
          </motion.div>
        )}

        {uploadStatus === "selecting" && (
          <motion.div
            key="selecting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                {players.length} {players.length === 1 ? "Player" : "Players"}{" "}
                Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Select a player to generate their avatar
              </p>
            </div>
            <motion.div className="grid gap-4">
              {players.map((player, index) => (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedPlayer?.name === player.name
                      ? "border-primary bg-primary/5 dark:bg-primary/10"
                      : "border-gray-200 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50"
                  }`}
                  onClick={() => handlePlayerSelect(player)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative rounded-lg overflow-hidden transition-colors">
                        <Image
                          src="/sprite.png"
                          alt="Placeholder sprite"
                          width={50}
                          height={50}
                          className="object-contain animate-pulse"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{player.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {player.gender} Character
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Select
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {uploadStatus === "uploading" && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="rounded-full h-8 w-8 border-t-2 border-primary border-solid"
            ></motion.div>
            <p className="text-gray-500 dark:text-gray-400">
              Generating avatar...
            </p>
          </motion.div>
        )}

        {uploadStatus === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-4"
          >
            <p className="text-red-500 dark:text-red-400">{errorMessage}</p>
            <Button onClick={() => setUploadStatus("idle")}>Try Again</Button>
          </motion.div>
        )}

        {uploadStatus === "success" && generatedImageUrl && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="relative mx-auto w-32 h-32 rounded-lg overflow-hidden flex items-center justify-center"
            >
              <Image
                src={generatedImageUrl}
                alt={`${selectedPlayer?.name}'s avatar`}
                className="object-contain"
                fill
              />
            </motion.div>
            <div className="space-y-4">
              <p className="text-green-500 dark:text-green-400">
                Avatar generated successfully!
              </p>
              <Button onClick={() => setUploadStatus("idle")}>
                Generate Another
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedPlayer && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Debug Data</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebug(!showDebug)}
            >
              {showDebug ? "Hide" : "Show"} Debug
            </Button>
          </div>
          {showDebug && (
            <motion.pre
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto text-sm"
            >
              {JSON.stringify(selectedPlayer, null, 2)}
            </motion.pre>
          )}
        </motion.div>
      )}
    </div>
  );
}
