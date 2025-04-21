export function extractArrayOrString(arrOrStr: string | string[]) {
  if (Array.isArray(arrOrStr)) {
    return undefined;
  }
  return arrOrStr;
}
