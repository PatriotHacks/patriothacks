import { readFile } from "node:fs/promises";
import { join } from "node:path";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Header } from "./header";

/** Renders a Markdown document from /content verbatim. */
export async function LegalPage({ file }: { file: string }) {
  const source = await readFile(join(process.cwd(), "content", file), "utf8");

  return (
    <>
      <Header />
      <main className="bg-paper px-6 py-16 sm:px-8 sm:py-20">
        <article className="prose prose-legal mx-auto max-w-3xl">
          <Markdown remarkPlugins={[remarkGfm]}>{source}</Markdown>
        </article>
      </main>
    </>
  );
}
