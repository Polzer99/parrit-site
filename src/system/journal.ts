import "server-only";

// Shared with the local prebuild generator; never import the reader in a client.
export { getAllJournalEntries, getAllJournalEntrySummaries, getJournalEntry } from "./journal-data.ts";
export type { JournalEntry, JournalEntrySummary } from "./journal-data.ts";
