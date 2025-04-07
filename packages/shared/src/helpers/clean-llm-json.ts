const cleanLLMJson = (props: {
  response: string;
  requiredFields: string[];
  preserveFormatting?: boolean;
}) => {
  const { response, preserveFormatting = true } = props;
  const requiredFields = props?.requiredFields ?? [];

  // First attempt: standard JSON parsing
  let strippedResponse = (response ?? "").replace(/^```json\s*|\s*```$/g, ""); // Always remove JSON code block markers

  if (!preserveFormatting) {
    // Apply standard cleaning
    strippedResponse = strippedResponse.replace(/\\n/g, " ").trim();
  }

  try {
    // Try parsing as is first
    const parsedHint = JSON.parse(strippedResponse);

    // Validate required fields
    const missingFields = requiredFields.filter((field) =>
      Array.isArray(parsedHint)
        ? parsedHint.every((item) => typeof item[field] === "undefined")
        : typeof parsedHint?.[field] === "undefined"
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Invalid LLM format: Missing required fields: ${missingFields.join(
          ", "
        )}`
      );
    }

    return parsedHint;
  } catch (initialParseError) {
    // Second attempt: apply more aggressive JSON fixing strategies
    try {
      // Handle the common case of unescaped quotes inside JSON string values
      // This regex searches for unescaped quotes within string values
      const fixedJson = strippedResponse.replace(
        /: *"([^"\\]*(?:\\.[^"\\]*)*)"/g,
        (match) => {
          // Replace any unescaped quotes in the content with escaped quotes
          return match.replace(/([^\\])"/g, '$1\\"').replace(/^: *"/, ': "');
        }
      );

      const parsedHint = JSON.parse(fixedJson);

      // Validate required fields
      const missingFields = requiredFields.filter((field) =>
        Array.isArray(parsedHint)
          ? parsedHint.every((item) => typeof item[field] === "undefined")
          : typeof parsedHint?.[field] === "undefined"
      );

      if (missingFields.length > 0) {
        throw new Error(
          `Invalid LLM format: Missing required fields: ${missingFields.join(
            ", "
          )}`
        );
      }

      return parsedHint;
    } catch (fallbackParseError: any) {
      console.error("Failed to parse JSON even after fixes:", strippedResponse);
      console.error("Fallback parse error:", fallbackParseError);
      throw fallbackParseError;
    }
  }
};

export default cleanLLMJson;
