import { Button } from "@/components/ui/button"

export default function GenerateButton() {
  return (
    <>
      <div className="hidden sm:block">
        <Button>Generate Farmer</Button>
      </div>
      <div className="block sm:hidden">
        <Button>Generate</Button>
      </div>
    </>
  )
}