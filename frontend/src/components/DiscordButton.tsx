import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DiscordButton() {
  return (
    <Button data-umami-event="Discord button" asChild>
      <Link href="https://discord.gg/NkgNVZwQ2M">Discord</Link>
    </Button>
  );
}
