function PageBanner({ title, text }) {
  return (
    <section className="page-banner">
      <div className="container">
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  )
}

export default PageBanner