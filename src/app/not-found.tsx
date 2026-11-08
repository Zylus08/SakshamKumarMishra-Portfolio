import Link from "next/link";
export default function NotFound() {
  return (
    <div className="section empty not-found">
      <p className="eyebrow">404 / UNCHARTED TERRITORY</p>
      <h1>A useful detour.</h1>
      <p>This page doesn’t exist. There are other ideas to explore.</p>
      <Link className="button" href="/">
        Back to the atelier ↗
      </Link>
    </div>
  );
}
