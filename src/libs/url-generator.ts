export default (url: string) => {
  try {
    return [
      new URL(url),
      null,
    ]
  } catch (err) {
    return [
      null,
      err,
    ]
  }
}
