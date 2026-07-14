import catalogJson from "../../content/agents/catalog.json";
import catalogI18nJson from "../../content/agents/catalog.i18n.json";

export type AgentStatus = "deployed" | "demo";

export type CatalogLocale = "fr" | "en" | "pt-BR" | "zh-CN";

type CaseI18n = { title?: string; desc?: string; sector?: string };
type LocaleOverlay = {
  personas?: Record<string, string>;
  cases?: Record<string, CaseI18n>;
};
const catalogI18n = catalogI18nJson as Record<string, LocaleOverlay>;

export type AgentPersona = {
  key: string;
  name: string;
  label: string;
  imageSrc: string;
};

export type AgentCase = {
  id: string;
  dept: string;
  status: AgentStatus;
  featured: boolean;
  title: string;
  desc: string;
  sector: string;
  date: string;
};

export type AgentGroup = {
  persona: AgentPersona;
  cases: AgentCase[];
  extraCases: AgentCase[];
};

export type AgentCatalog = {
  groups: AgentGroup[];
  deployedCount: number;
  visibleCount: number;
};

type CatalogOptions = {
  perDept?: number;
  lang?: CatalogLocale;
};

type RawPersona = {
  name: string;
  label: string;
  img: string;
  order?: number;
};

type RawCase = {
  id: string;
  dept: string;
  status: AgentStatus;
  featured?: boolean;
  title: string;
  desc: string;
  sector: string;
  date: string;
};

type RawCatalog = {
  personas: Record<string, RawPersona>;
  cases: RawCase[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, key: string, context: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid agent catalog: ${context}.${key} must be a non-empty string`);
  }
  return value;
}

function readBoolean(record: Record<string, unknown>, key: string): boolean | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") {
    throw new Error(`Invalid agent catalog: ${key} must be a boolean`);
  }
  return value;
}

function readNumber(record: Record<string, unknown>, key: string): number | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid agent catalog: ${key} must be a finite number`);
  }
  return value;
}

function readStatus(record: Record<string, unknown>, context: string): AgentStatus {
  const status = readString(record, "status", context);
  if (status !== "deployed" && status !== "demo") {
    throw new Error(`Invalid agent catalog: ${context}.status must be "deployed" or "demo"`);
  }
  return status;
}

function parseCatalog(value: unknown): RawCatalog {
  if (!isRecord(value)) {
    throw new Error("Invalid agent catalog: root must be an object");
  }

  const rawPersonas = value.personas;
  if (!isRecord(rawPersonas)) {
    throw new Error("Invalid agent catalog: personas must be an object");
  }

  const personas: Record<string, RawPersona> = {};
  for (const [key, personaValue] of Object.entries(rawPersonas)) {
    if (!isRecord(personaValue)) {
      throw new Error(`Invalid agent catalog: personas.${key} must be an object`);
    }
    personas[key] = {
      name: readString(personaValue, "name", `personas.${key}`),
      label: readString(personaValue, "label", `personas.${key}`),
      img: readString(personaValue, "img", `personas.${key}`),
      order: readNumber(personaValue, "order"),
    };
  }

  if (!Array.isArray(value.cases)) {
    throw new Error("Invalid agent catalog: cases must be an array");
  }

  const cases = value.cases.map((caseValue, index): RawCase => {
    const context = `cases[${index}]`;
    if (!isRecord(caseValue)) {
      throw new Error(`Invalid agent catalog: ${context} must be an object`);
    }
    return {
      id: readString(caseValue, "id", context),
      dept: readString(caseValue, "dept", context),
      status: readStatus(caseValue, context),
      featured: readBoolean(caseValue, "featured"),
      title: readString(caseValue, "title", context),
      desc: readString(caseValue, "desc", context),
      sector: readString(caseValue, "sector", context),
      date: readString(caseValue, "date", context),
    };
  });

  return { personas, cases };
}

const rawCatalog = parseCatalog(catalogJson as unknown);

function toCase(rawCase: RawCase): AgentCase {
  return {
    id: rawCase.id,
    dept: rawCase.dept,
    status: rawCase.status,
    featured: rawCase.featured ?? false,
    title: rawCase.title,
    desc: rawCase.desc,
    sector: rawCase.sector,
    date: rawCase.date,
  };
}

function sortCases(a: AgentCase, b: AgentCase): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  return b.date.localeCompare(a.date);
}

export function getCatalog(options: CatalogOptions = {}): AgentCatalog {
  const perDept = options.perDept;
  const overlay = options.lang && options.lang !== "fr" ? catalogI18n[options.lang] : undefined;
  const localizeCase = (agentCase: AgentCase): AgentCase => {
    const tr = overlay?.cases?.[agentCase.id];
    if (!tr) return agentCase;
    return {
      ...agentCase,
      title: tr.title ?? agentCase.title,
      desc: tr.desc ?? agentCase.desc,
      sector: tr.sector ?? agentCase.sector,
    };
  };

  const allCases = rawCatalog.cases
    .map(toCase)
    .filter((agentCase) => agentCase.status === "deployed" || agentCase.featured)
    .map(localizeCase);

  const groups = Object.entries(rawCatalog.personas)
    .sort(([, a], [, b]) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))
    .map(([key, persona]) => {
      const cases = allCases
        .filter((agentCase) => agentCase.dept === key)
        .sort(sortCases);
      const visibleCases = perDept === undefined ? cases : cases.slice(0, perDept);

      return {
        persona: {
          key,
          name: persona.name,
          label: overlay?.personas?.[key] ?? persona.label,
          imageSrc: `/brand/agents/${persona.img}`,
        },
        cases: visibleCases,
        extraCases: cases.slice(visibleCases.length),
      };
    });

  return {
    groups,
    deployedCount: rawCatalog.cases.filter((agentCase) => agentCase.status === "deployed").length,
    visibleCount: allCases.length,
  };
}

export function getAllCatalogCases(): AgentCase[] {
  return rawCatalog.cases
    .map(toCase)
    .filter((agentCase) => agentCase.status === "deployed" || agentCase.featured)
    .sort(sortCases);
}
