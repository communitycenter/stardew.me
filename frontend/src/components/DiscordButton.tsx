import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DiscordButton() {
  return (
    <Button asChild>
        <Link href="https://discord.gg/NkgNVZwQ2M">Discord</Link>
    </Button>
  )
}
