import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GitHubButton() {
  return (
    <Button asChild variant="secondary">
        <Link href="https://github.com/communitycenter">GitHub</Link>
    </Button>
  )
}
