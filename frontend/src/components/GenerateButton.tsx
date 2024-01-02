import { Button } from "@/components/ui/button";

export default function GenerateButton() {
  return (
    <>
      <div className="hidden sm:block">
        <Button data-umami-event="Generate farmer">Generate Farmer</Button>
      </div>
      <div className="block sm:hidden">
        <Button data-umami-event="Generate farmer">Generate</Button>
      </div>
    </>
  );
}
