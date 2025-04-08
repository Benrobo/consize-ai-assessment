export const VALID_SOURCES = ["indeed"] as const;

export const VALID_JOBS_SOURCE_COUNTRIES = {
  indeed: [
    { name: "Nigeria", code: "ng" },
    { name: "United Kingdom", code: "uk" },
    { name: "United States", code: "us" },
    { name: "Canada", code: "ca" },
    { name: "Germany", code: "de" },
    { name: "Australia", code: "au" },
    { name: "South Africa", code: "za" },
    { name: "Sweden", code: "se" },
    { name: "Singapore", code: "sg" },
    { name: "Switzerland", code: "ch" },
    { name: "United Arab Emirates", code: "ae" },
    { name: "New Zealand", code: "nz" },
    { name: "India", code: "in" },
    { name: "France", code: "fr" },
    { name: "Italy", code: "it" },
    { name: "Spain", code: "es" },
    { name: "Japan", code: "jp" },
    { name: "South Korea", code: "kr" },
    { name: "Brazil", code: "br" },
    { name: "Mexico", code: "mx" },
    { name: "China", code: "cn" },
    { name: "Saudi Arabia", code: "sa" },
    { name: "Egypt", code: "eg" },
    { name: "Thailand", code: "th" },
    { name: "Vietnam", code: "vn" },
    { name: "Argentina", code: "ar" },
    { name: "Ireland", code: "ie" },
  ],
} as Record<
  (typeof VALID_SOURCES)[number],
  Array<{
    name: string;
    code: string;
  }>
>;
