import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GitHubButton() {
  return (
    <Button data-umami-event="GitHub button" asChild variant="secondary">
      <Link href="https://github.com/communitycenter/stardew.me">GitHub</Link>
    </Button>
  );
}
