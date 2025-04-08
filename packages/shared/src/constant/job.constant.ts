export const VALID_SOURCES = ["indeed"] as const;

export const VALID_JOBS_SOURCE_COUNTRIES = {
  indeed: [
    { name: "Nigeria", code: "ng", pathname: "ng.indeed.com" },
    { name: "United Kingdom", code: "uk", pathname: "uk.indeed.com" },
    { name: "United States", code: "us", pathname: "indeed.com" },
    { name: "Canada", code: "ca", pathname: "ca.indeed.com" },
    { name: "Germany", code: "de", pathname: "de.indeed.com" },
    { name: "Australia", code: "au", pathname: "au.indeed.com" },
    { name: "South Africa", code: "za", pathname: "za.indeed.com" },
    { name: "Sweden", code: "se", pathname: "se.indeed.com" },
    { name: "Singapore", code: "sg", pathname: "sg.indeed.com" },
    { name: "Switzerland", code: "ch", pathname: "ch.indeed.com" },
    { name: "United Arab Emirates", code: "ae", pathname: "ae.indeed.com" },
    { name: "New Zealand", code: "nz", pathname: "nz.indeed.com" },
    { name: "India", code: "in", pathname: "in.indeed.com" },
    { name: "France", code: "fr", pathname: "fr.indeed.com" },
    { name: "Italy", code: "it", pathname: "it.indeed.com" },
    { name: "Spain", code: "es", pathname: "es.indeed.com" },
    { name: "Japan", code: "jp", pathname: "jp.indeed.com" },
    { name: "South Korea", code: "kr", pathname: "kr.indeed.com" },
    { name: "Brazil", code: "br", pathname: "br.indeed.com" },
    { name: "Mexico", code: "mx", pathname: "mx.indeed.com" },
    { name: "China", code: "cn", pathname: "cn.indeed.com" },
    { name: "Saudi Arabia", code: "sa", pathname: "sa.indeed.com" },
    { name: "Egypt", code: "eg", pathname: "eg.indeed.com" },
    { name: "Thailand", code: "th", pathname: "th.indeed.com" },
    { name: "Vietnam", code: "vn", pathname: "vn.indeed.com" },
    { name: "Argentina", code: "ar", pathname: "ar.indeed.com" },
    { name: "Ireland", code: "ie", pathname: "ie.indeed.com" },
  ],
} as Record<
  (typeof VALID_SOURCES)[number],
  Array<{
    name: string;
    code: string;
    pathname: string;
  }>
>;
