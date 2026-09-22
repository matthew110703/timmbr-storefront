import { strings } from "./strings";

export default function HomePage() {
  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero">
        <div className="pill-tag">
          <span className="status-dot" />
          <span>{strings.hero.pill}</span>
        </div>

        <h1 className="hero-title">
          {strings.hero.title} <br />
          <span className="hero-title-accent">{strings.hero.titleAccent}</span>
        </h1>

        <p className="hero-description">{strings.hero.description}</p>

        <div className="hero-actions">
          <a href="/health" target="_blank" className="btn-primary">
            <span>{strings.hero.ctaProbe}</span>
          </a>
        </div>
      </section>

      {/* Control Plane Status */}
      <section style={{ maxWidth: "800px", margin: "0 auto 4rem" }}>
        <div className="zone-card active-zone">
          <div className="zone-header">
            <div className="zone-icon">🌐</div>
            <span className="zone-tag tag-active">
              {strings.controlPlaneCard.tag}
            </span>
          </div>
          <h3 className="zone-name">
            {strings.controlPlaneCard.name}
            <span className="zone-path">{strings.controlPlaneCard.path}</span>
          </h3>
          <p className="zone-description">
            {strings.controlPlaneCard.description}
          </p>
          <div className="zone-meta">
            <span>
              {strings.controlPlaneCard.portLabel}{" "}
              <strong>{strings.controlPlaneCard.portValue}</strong>
            </span>
            <span>
              {strings.controlPlaneCard.nextAppsLabel}{" "}
              <strong>{strings.controlPlaneCard.nextAppsValue}</strong>
            </span>
            <span>
              {strings.controlPlaneCard.bundlerLabel}{" "}
              <strong>{strings.controlPlaneCard.bundlerValue}</strong>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
