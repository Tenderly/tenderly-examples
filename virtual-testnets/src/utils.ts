export function basename(uri: string) {
  return uri.split("/").reverse()[0];
}