
import { SessionProvider } from "@/context/SessionContext";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Head from "next/head";


const inter = Inter({
  subsets: ["latin"],
});

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider>
      <Head>
        <title>NFSU Quiz</title>
      </Head>
      <main
        className={`${inter.className} min-h-svh max-w-md mx-auto bg-white`}
      >
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
