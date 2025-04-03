import Upload from "@/components/Upload";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24">
        <Upload />
      </div>
      <Footer />
    </main>
  );
}
