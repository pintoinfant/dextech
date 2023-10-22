import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html
      lang="en"
      className="h-full bg-gray-900"
      style={{ scrollBehavior: "smooth" }}
    >
      <Head />
      <body className="min-h-full bg-gray-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
