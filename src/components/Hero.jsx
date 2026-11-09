const highlights = ['React', 'Firebase', 'Responsive UI']

function Hero() {
  return (
    <section className="section hero" aria-labelledby="hero-title">
      <div>
        <p className="eyebrow">Frontend Developer</p>
        <h2 id="hero-title">Building thoughtful portfolio experiences.</h2>
        <p>
          This scaffold is structured for a personal portfolio with a clear
          content model and simple admin entry points.
        </p>
      </div>
      <ul className="chip-list" aria-label="Core technologies">
        {highlights.map((item) => (
          <li key={item} className="chip">
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Hero