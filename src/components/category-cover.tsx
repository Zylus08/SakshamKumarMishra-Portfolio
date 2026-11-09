import Image from "next/image";
import { availablePhotograph } from "@/lib/asset-files";
import type { Photograph } from "@/lib/assets";

export function CategoryCover({ photo }: { photo: Photograph | null }) {
  const available = availablePhotograph(photo);
  return (
    <span className="category-cover-photo">
      {available ? (
        <Image
          src={available.src}
          alt={available.alt}
          width={available.width}
          height={available.height}
          sizes="(max-width: 900px) 74vw, 40vw"
          style={{ objectPosition: available.objectPosition }}
        />
      ) : (
        <span className="category-cover-fallback" aria-hidden="true">
          SKM / NOTES
        </span>
      )}
    </span>
  );
}
