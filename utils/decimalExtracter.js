export function extractDecimal(val) {
  if (typeof val === "object" && val !== null && "$numberDecimal" in val) {
    return val.$numberDecimal;
  }
  return "N/A"; // or 0.00 if you prefer
}