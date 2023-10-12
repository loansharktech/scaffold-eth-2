import type { FunctionComponent, PropsWithChildren } from "react";
import Head from "next/head";
import Nav from "~~/components/common/Nav";

const App: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-screen text-dark1 overflow-x-hidden font-inter">
      <Head>
        <title>Loanshark</title>
        <meta name="description" content="Risk-Isolated Money Market on Scroll" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Nav></Nav>
      {children}
    </div>
  );
};

export default App;
