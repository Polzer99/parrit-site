import type { Locale } from "@/system/locale";

// Décision de Paul du 15/11/2026 : un calculateur sur les chiffres du visiteur.
// Aucun gain client n'a été mesuré : le résultat décrit ce que la tâche coûte
// aujourd'hui, jamais un gain promis (CASE-STUDIES-EVIDENCE-MATRIX l.1535-1560).

type Text = { fr: string; en: string };

export const QUOTE_DEFAULTS = { quotes: 20, signedShare: 15, amount: 3000 } as const;
export const HOURLY_COST_DEFAULT = 40;

export const TIME_TASKS = [
  { id: "commandes", label: { fr: "Saisie des commandes", en: "Order entry" }, perWeek: 40, minutes: 6 },
  { id: "rapprochement", label: { fr: "Rapprochement bancaire", en: "Bank reconciliation" }, perWeek: 50, minutes: 2 },
  { id: "comptes-rendus", label: { fr: "Comptes rendus de réunion", en: "Meeting notes" }, perWeek: 5, minutes: 30 },
] as const satisfies readonly { id: string; label: Text; perWeek: number; minutes: number }[];

/** Empty, negative or non-numeric input counts as zero. Thousands spaces (« 3 000 ») are read. */
export function inputNumber(value: unknown): number {
  const n = typeof value === "number" ? value : Number(String(value ?? "").replace(/[\s  ]/g, "").replace(",", ".") || 0);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Quote value per month that depends on follow-up: count × share × average amount. */
export function quotesAtStake(quotes: unknown, signedShare: unknown, amount: unknown): number {
  return Math.round(inputNumber(quotes) * Math.min(inputNumber(signedShare), 100) / 100 * inputNumber(amount));
}

/** Hours per month spent on a task (to the hour, one decimal under one hour) and their cost on the exact hours. */
export function taskCost(perWeek: unknown, minutes: unknown, hourlyCost: unknown): { hours: number; cost: number } {
  const exact = inputNumber(perWeek) * inputNumber(minutes) * 52 / 12 / 60;
  const hours = exact >= 1 ? Math.round(exact) : Math.round(exact * 10) / 10;
  return { hours, cost: Math.round(exact * inputNumber(hourlyCost)) };
}

export function formatHours(hours: number, locale: Locale): string {
  return `${new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", { maximumFractionDigits: 1 }).format(hours)} h`;
}

export function formatEuros(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

export const CALCULATOR_COPY = {
  fr: {
    growth: "Faire grandir l'activité.", growthProcess: "Devis restés sans relance",
    quotes: "Devis sans relance par mois", signedShare: "Part signée après relance (%)", amount: "Montant moyen d'un devis (€)",
    growthResult: "de devis par mois se jouent sur la relance.",
    time: "Libérer du temps.", task: "Tâche", perWeek: "Nombre par semaine", minutes: "Minutes chacune", hourlyCost: "Coût horaire (€)",
    timeResult: (cost: string) => `par mois passées sur cette tâche, soit environ ${cost}.`,
    note: "Vos chiffres, votre calcul.",
  },
  en: {
    growth: "Grow the business.", growthProcess: "Quotes left without follow-up",
    quotes: "Quotes without follow-up per month", signedShare: "Share signed after follow-up (%)", amount: "Average quote amount (€)",
    growthResult: "in quotes a month hinge on the follow-up.",
    time: "Save time.", task: "Task", perWeek: "Count per week", minutes: "Minutes each", hourlyCost: "Hourly cost (€)",
    timeResult: (cost: string) => `a month spent on this task, about ${cost}.`,
    note: "Your figures, your math.",
  },
} as const;
