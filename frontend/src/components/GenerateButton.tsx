import { Button } from "@/components/ui/button";
import { useUploadContext } from "../lib/UploadContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const DisabledGenerateButton = () => {
  return (
    <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Button className="disabled bg-neutral-500 hover:bg-neutral-500 dark:bg-neutral-400 dark:hover:bg-neutral-400 cursor-default">Generate Farmer</Button>
      </TooltipTrigger>
      <TooltipContent>
      <p>Upload a file first!</p>
      </TooltipContent>
    </Tooltip>
    </TooltipProvider>
  )
};

export default function GenerateButton() {
  const { selectedFile } = useUploadContext();

  return selectedFile ? <Button>Generate Farmer</Button> : <DisabledGenerateButton />;
}
