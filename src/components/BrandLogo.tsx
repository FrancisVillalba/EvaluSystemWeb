import './BrandLogo.css'

function BrandLogo() {
  return (
    <div className="brand-logo" aria-label="EvaluSystem">
      <svg
        className="brand-symbol"
        viewBox="0 0 64 52"
        role="img"
        aria-hidden="true"
      >
        <path d="M32 26c-8-8-8-17 0-24 8 7 8 16 0 24Z" />
        <path d="M30 29C18 27 12 20 14 10c10 1 16 8 16 19Z" />
        <path d="M34 29c12-2 18-9 16-19-10 1-16 8-16 19Z" />
        <path d="M32 33c-9 7-18 7-26 0 8-7 17-7 26 0Z" />
        <path d="M32 33c9 7 18 7 26 0-8-7-17-7-26 0Z" />
        <path d="M32 33v17" />
      </svg>
      <span className="brand-name">EVALUSYSTEM</span>
      <span className="brand-tagline">Impresion UV DTF y textil</span>
    </div>
  )
}

export default BrandLogo
