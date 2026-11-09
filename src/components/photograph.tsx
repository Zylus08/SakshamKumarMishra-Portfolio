import Image from "next/image";
import { availablePhotograph } from "@/lib/asset-files";
import type { Photograph as Photo } from "@/lib/assets";
export function Photograph({
  photo,
  variant = "portrait",
  compact = false,
}: {
  photo: Photo | null;
  variant?: "portrait" | "lifestyle";
  compact?: boolean;
}) {
  const available = availablePhotograph(photo);
  return (
    <figure
      className={`personal-photo ${compact ? "photo-compact" : ""} photo-${variant}`}
      data-reveal
    >
      {available ? (
        <Image
          src={available.src}
          alt={available.alt}
          width={available.width}
          height={available.height}
          sizes={
            compact
              ? "(max-width: 1100px) 105px, 155px"
              : "(max-width: 700px) 88vw, 42vw"
          }
          style={{ objectPosition: available.objectPosition }}
          preload={compact}
        />
      ) : (
        <div className="photo-fallback">
          <span className="micro">
            {variant === "portrait"
              ? "THE PERSON / SKM"
              : "A LIFE OUTSIDE THE EDITOR"}
          </span>
          <p>
            {variant === "portrait" ? (
              <>
                A curious mind.
                <br />
                <em>Rooted in Delhi.</em>
              </>
            ) : (
              <>
                City rhythms.
                <br />
                <em>Quiet observations.</em>
              </>
            )}
          </p>
          <span className="micro">
            {variant === "portrait"
              ? "DELHI → PATIALA"
              : "DELHI, INDIA / 28.61° N"}
          </span>
        </div>
      )}
    </figure>
  );
}
