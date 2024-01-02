import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Upload from "../components/Upload";

export default function Index() {
  return (
    <>
      <Head>
        <title>stardew.me | Stardew Valley Avatar Generator</title>
        <meta
          name="description"
          content="Generate your own Stardew Valley avatar sprites from a save file. Create a unique digital representation of your in-game character."
        />
        <meta
          name="keywords"
          content="stardew valley, stardew, avatar, generator, stardew avatar, stardew generator, stardew valley avatar, stardew valley generator, stardew valley avatar generator, stardew valley avatar maker, stardew valley maker, stardew valley avatar creator, stardew valley creator, stardew valley avatar generator, stardew, stardew pixel art, stardew avatar generator"
        />
        <meta name="author" content="stardew.me" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@1afond @clxmente" />
        <meta name="twitter:title" content="stardew.me" />
        <meta
          name="twitter:description"
          content="Generate your own Stardew Valley avatar sprites from a save file. Create a unique digital representation of your in-game character."
        />
        <meta
          name="twitter:image"
          content="https://stardew.me/assets/logo.png"
        />
        <meta property="og:title" content="stardew.me" />
        <meta
          property="og:description"
          content="Generate your own Stardew Valley avatar sprites from a save file. Create a unique digital representation of your in-game character."
        />
        <meta
          property="og:image"
          content="https://stardew.me/assets/logo.png"
        />
        <meta property="og:url" content="https://stardew.me" />
        <meta property="og:site_name" content="stardew.me" />
        <meta property="og:type" content="website" />
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <link rel="icon" href="https://stardew.me/assets/logo.png" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Upload />
        </main>
        <Footer />
      </div>
    </>
  );
}
