import TurndownService from "turndown";

const turndownService = new TurndownService();

// invalid tags that are useless to LLM
const invalidHtmlTags = [
  //   "script",
  "style",
  "noscript",
  "iframe",
  //   "img",
  "svg",
  "canvas",
  "video",
  "audio",
  //   "embed",
  //   "object",
  //   "applet",
  //   "form",
  //   "input",
  //   "textarea",
  //   "select",
  //   "option",
  //   "datalist",
  //   "optgroup",
  //   "head",
] as TurndownService.Filter[];

export function convertHtmlToMarkdown(html: string) {
  invalidHtmlTags.forEach((t) => {
    turndownService.remove(t);
  });

  return turndownService.turndown(html);
}
