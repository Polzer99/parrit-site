// Règle d'or n° 6 amendée le 25/10/2026 : seuls ces clients peuvent être nommés publiquement.
export const PUBLIC_CLIENT_NAMES = ["Laparra", "Clevery", "Forexpert", "Joone", "SNCF"] as const;

export function publicClientName(name: string): typeof PUBLIC_CLIENT_NAMES[number] | undefined {
  const normalized = name.trim().toLowerCase();
  return PUBLIC_CLIENT_NAMES.find((value) => value.toLowerCase() === normalized ||
    (value === "Clevery" && normalized === "clevery avocats"));
}
