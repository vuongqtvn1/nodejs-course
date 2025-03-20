export const tryParseJson = (str: any) => {
  try {
    return JSON.parse(str)
  } catch (error) {
    return {}
  }
}
