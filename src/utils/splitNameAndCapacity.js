export const splitNameAndCapacity = (fullName = "") => {
  const cleanName = fullName
    .replace(/[\u2013\u2014\u2012\u2010\u2011]/g, "-") // chuẩn hóa dash Unicode
    .replace(/[\s\u00A0]*[-\u2010-\u2015][\s\u00A0]*/g, " - "); // chuẩn hóa mọi dấu gạch về " - "

  const [baseName, capacity = "default"] = cleanName
    .split(" - ")
    .map((part) => part.trim());

  return { baseName, capacity };
};
