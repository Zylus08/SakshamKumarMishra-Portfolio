import fs from "node:fs";
import path from "node:path";
import {
  documents,
  type ProfessionalDocument,
  photographs,
  type Photograph,
} from "./assets";
function localFile(src: string, folder: string, root: string) {
  if (
    !new RegExp(`^/${folder}/[a-zA-Z0-9][a-zA-Z0-9/_-]*\\.[a-zA-Z0-9]+$`).test(
      src,
    )
  )
    return null;
  const base = path.resolve(root, folder),
    candidate = path.resolve(root, `.${src}`);
  if (!candidate.startsWith(base + path.sep) || !fs.existsSync(candidate))
    return null;
  const real = fs.realpathSync(candidate);
  return real.startsWith(fs.realpathSync(base) + path.sep) &&
    fs.statSync(real).isFile()
    ? real
    : null;
}
export function availableDocuments(
  items: ProfessionalDocument[] = documents,
  root = path.join(process.cwd(), "public"),
) {
  return items.filter((item) => {
    if (!item.file) return false;
    const file = localFile(item.file, "documents", root);
    if (
      !file ||
      !item.file.endsWith(".pdf") ||
      !/^[A-Za-z0-9_-]+\.pdf$/.test(item.downloadName)
    )
      return false;
    const fd = fs.openSync(file, "r");
    try {
      const signature = Buffer.alloc(5);
      fs.readSync(fd, signature, 0, 5, 0);
      return signature.toString() === "%PDF-";
    } finally {
      fs.closeSync(fd);
    }
  });
}
export function availablePhotograph(
  photo: Photograph | null,
  root = path.join(process.cwd(), "public"),
) {
  if (
    !photo ||
    !photo.alt.trim() ||
    photo.width <= 0 ||
    photo.height <= 0 ||
    !/^\d{1,3}% \d{1,3}%$/.test(photo.objectPosition)
  )
    return null;
  const file = localFile(photo.src, "images", root);
  if (!file) return null;
  const bytes = fs.readFileSync(file);
  const format = photo.src.toLowerCase().split(".").pop();
  const valid =
    format === "jpg" || format === "jpeg"
      ? bytes[0] === 255 && bytes[1] === 216
      : format === "png"
        ? bytes
            .subarray(0, 8)
            .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : format === "webp"
          ? bytes.toString("ascii", 0, 4) === "RIFF" &&
            bytes.toString("ascii", 8, 12) === "WEBP"
          : false;
  return valid ? photo : null;
}
export function validateAssetConfiguration() {
  const available = availableDocuments();
  for (const item of documents)
    if (item.file && !available.some((d) => d.id === item.id))
      throw new Error(`Missing or invalid PDF: ${item.id}`);
  for (const [key, photo] of Object.entries(photographs))
    if (photo && !availablePhotograph(photo))
      throw new Error(`Missing or invalid photograph: ${key}`);
}
