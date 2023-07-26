import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FarmerView() {
  const avatarUrl = localStorage.getItem("avatarUrl");
  const playerInfo = localStorage.getItem("playerInfo");

  return (
    <div>
      <div className="flex mx-auto max-w-2xl w-full">
        <div className="mt-48 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-48 h-80 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-white dark:bg-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition ease-in-out duration-150">
              <div className="flex flex-col items-center justify-center pt-6 pb-6">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <img
                    src={avatarUrl ? avatarUrl : "default-placeholder.jpg"}
                    alt="Avatar"
                  />
                </p>
              </div>
            </label>
          </div>
        </div>
        <div className="mt-48">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Here&apos;s your farmer!
          </h1>
        </div>
      </div>
      <div className="mt-4 mx-auto max-w-2xl sm:px-6 lg:px-8">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Expert Mode</AccordionTrigger>
            <AccordionContent>
              <div className="mt-4 bg-[#0F111A] h-48 rounded-lg">
                <div className="px-2">
                  <p className="text-gray-100">
                    <pre>
                      <code>{playerInfo}</code>
                    </pre>
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
