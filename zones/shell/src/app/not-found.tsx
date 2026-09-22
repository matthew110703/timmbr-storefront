import Link from "next/link";
import { strings } from "./strings";

export default function NotFound() {
  return (
    <div
      className="container"
      style={{ textAlign: "center", padding: "6rem 1rem" }}
    >
      <div
        className="pill-tag"
        style={{ color: "#f87171", borderColor: "rgba(239, 68, 68, 0.3)" }}
      >
        <span>{strings.notFound.pill}</span>
      </div>
      <h1
        className="hero-title"
        style={{ fontSize: "3rem", marginBottom: "1rem" }}
      >
        {strings.notFound.title}
      </h1>
      <p className="hero-description" style={{ maxWidth: "500px" }}>
        {strings.notFound.description}
      </p>
      <Link href="/" className="btn-primary">
        {strings.notFound.ctaHome}
      </Link>
    </div>
  );
}
