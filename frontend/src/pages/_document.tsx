import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          async
          src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js"
        ></script>
        <script
          async
          src="https://eu.umami.is/script.js"
          data-website-id="2e4c85c3-1c6a-4969-9c3d-de264789c546"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
