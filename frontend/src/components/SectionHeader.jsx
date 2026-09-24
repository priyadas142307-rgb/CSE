function SectionHeader({ title, subtitle }) {
  return (
    <div className="section-header">
      <span className="section-tag">CSE Society</span>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  )
}

export default SectionHeader