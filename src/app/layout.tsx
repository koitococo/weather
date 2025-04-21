"use client";
import "@/styles/globals.css";
import { AppContextProvider } from "@/utils/ctx";
import { AMAP_JS_KEY } from "@/utils/env";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <title>Hanwan Weather Refactored</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        {/* eslint-disable-next-line no-sync-scripts */}
        <script src="/iconfont.js"></script>
      </head>
      <body className={inter.className}>
        <AppContextProvider amap_js_key={AMAP_JS_KEY}>{children}</AppContextProvider>
      </body>
    </html>
  );
}
