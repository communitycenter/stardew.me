import * as React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import { AvatarProvider } from "../lib/AvatarContext";
import { UploadProvider } from "../lib/UploadContext";
import * as Fathom from "fathom-client";

import "../styles/globals.css";

import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    // Initialize Fathom when the app loads
    // Example: yourdomain.com
    //  - Do not include https://
    //  - This must be an exact match of your domain.
    //  - If you're using www. for your domain, make sure you include that here.
    Fathom.load("AKVRASRP", {
      includedDomains: ["stardew.me"],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    // Record a pageview when route changes
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, []);

  return (
    <>
      <UploadProvider>
        <AvatarProvider>
          <ThemeProvider attribute="class">
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
            </Head>
            <main>
              <Component {...pageProps} />
              <Toaster />
            </main>
          </ThemeProvider>
        </AvatarProvider>
      </UploadProvider>
    </>
  );
}
