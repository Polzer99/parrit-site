import Link from "next/link";
import { avecSource } from "@/lib/registry/cta";
import { localizedPath, type Locale } from "../locale";
import ReactMarkdown from "react-markdown";
import { journalMarkdownBlocks } from "../journal-markdown.ts";

// Both prose and cells use the existing safe Markdown renderer. Raw HTML never
// becomes executable markup, and React Markdown filters unsafe link schemes.
export function JournalMachineBody({ content }: { content: string }) {
  return journalMarkdownBlocks(content).map((block, index) => block.kind === "markdown"
    ? <ReactMarkdown key={index}>{block.text}</ReactMarkdown>
    : <table className="journal-machine-table" key={index}>
      <thead><tr>{block.headings.map((heading, column) => <th scope="col" key={column}><ReactMarkdown components={{ p: ({ children }) => <>{children}</> }}>{heading}</ReactMarkdown></th>)}</tr></thead>
      <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, column) => <td key={column}><ReactMarkdown components={{ p: ({ children }) => <>{children}</> }}>{cell}</ReactMarkdown></td>)}</tr>)}</tbody>
    </table>);
}


export function JournalMachineFooter({ locale, contentLocale, slug }: { locale: Locale; contentLocale: Locale; slug: string }) {
  return <footer className="journal-body" lang={contentLocale}>
    <p>{contentLocale === "fr" ? "Paul Larmaraud, fondateur de Parrit.ai" : "Paul Larmaraud, founder of Parrit.ai"}</p>
    <p><Link href={avecSource(localizedPath("/rendez-vous", locale), `journal-${slug}`)}>{contentLocale === "fr" ? "Un échange de 15 minutes avec Paul Larmaraud." : "A 15-minute conversation with Paul Larmaraud."}</Link></p>
  </footer>;
}
