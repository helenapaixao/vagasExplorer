/** Lowercases and strips accents so "Júnior", "junior" and "JUNIOR" all match. */
export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export interface FilterOption {
  value: string;
  label: string;
  /**
   * Words sent to the GitHub search API. Only the first is used per selected
   * group, so the query stays an AND of one word per group — the search API
   * has no reliable OR operator.
   */
  terms: string[];
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

export const FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'regime',
    label: 'Regime',
    options: [
      { value: 'remoto', label: 'Remoto', terms: ['remoto'] },
      { value: 'hibrido', label: 'Híbrido', terms: ['híbrido'] },
      { value: 'presencial', label: 'Presencial', terms: ['presencial'] },
    ],
  },
  {
    id: 'contrato',
    label: 'Contrato',
    options: [
      { value: 'clt', label: 'CLT', terms: ['CLT'] },
      { value: 'pj', label: 'PJ', terms: ['PJ'] },
      { value: 'estagio', label: 'Estágio', terms: ['estágio'] },
      { value: 'freela', label: 'Freela', terms: ['freelance'] },
    ],
  },
  {
    id: 'nivel',
    label: 'Nível',
    options: [
      { value: 'junior', label: 'Júnior', terms: ['júnior'] },
      { value: 'pleno', label: 'Pleno', terms: ['pleno'] },
      { value: 'senior', label: 'Sênior', terms: ['sênior'] },
      { value: 'especialista', label: 'Especialista', terms: ['especialista'] },
    ],
  },
  {
    id: 'stack',
    label: 'Stack',
    options: [
      { value: 'react', label: 'React', terms: ['react'] },
      { value: 'node', label: 'Node', terms: ['node'] },
      { value: 'python', label: 'Python', terms: ['python'] },
      { value: 'java', label: 'Java', terms: ['java'] },
      { value: 'php', label: 'PHP', terms: ['php'] },
      { value: 'vue', label: 'Vue', terms: ['vue'] },
      { value: 'flutter', label: 'Flutter', terms: ['flutter'] },
      { value: 'go', label: 'Go', terms: ['golang'] },
      { value: 'dotnet', label: '.NET', terms: ['dotnet'] },
      { value: 'qa', label: 'QA', terms: ['QA'] },
      { value: 'devops', label: 'DevOps', terms: ['devops'] },
      { value: 'dados', label: 'Dados', terms: ['dados'] },
    ],
  },
];

/** One selection per group, e.g. `{ regime: 'remoto', nivel: 'junior' }`. */
export type ActiveFilters = Record<string, string>;

export function findOption(
  groupId: string,
  value: string,
): FilterOption | undefined {
  return FILTER_GROUPS.find(g => g.id === groupId)?.options.find(
    o => o.value === value,
  );
}

/** Reads the selected filters out of a Next.js router query. */
export function parseFilters(
  query: Record<string, string | string[] | undefined>,
): ActiveFilters {
  const active: ActiveFilters = {};

  FILTER_GROUPS.forEach(group => {
    const raw = query[group.id];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value && findOption(group.id, value)) active[group.id] = value;
  });

  return active;
}

export function countActive(filters: ActiveFilters): number {
  return Object.keys(filters).length;
}

/** The options selected across all groups. */
export function selectedOptions(filters: ActiveFilters): FilterOption[] {
  return Object.entries(filters)
    .map(([groupId, value]) => findOption(groupId, value))
    .filter((option): option is FilterOption => option !== undefined);
}

/** One search word per selected group, ANDed together by GitHub. */
export function filtersToSearchTerms(filters: ActiveFilters): string[] {
  return selectedOptions(filters)
    .map(option => option.terms[0])
    .filter(Boolean);
}
