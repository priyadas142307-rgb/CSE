import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitEvent } from '../../services/api'

function SubmitEvent() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    details: '',
    image: null,
  })

  function handleChange(e) {
    const { name, value, files } = e.target
    if (name === 'image') {
      const file = files?.[0] || null
      setFormData((prev) => ({ ...prev, image: file }))
      if (file) setPreview(URL.createObjectURL(file))
      return
    }
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await submitEvent(formData)
      setStatus(result.message)
      setTimeout(() => navigate('/'), 1200)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="user-submit-section">
      <div className="container">
        <div className="user-submit-card user-submit-premium-card">
          <div className="submit-page-header">
            <span className="submit-page-chip">Event Submission</span>
            <h1>Add Event</h1>
            <p>Your submission will be reviewed by admin before publishing.</p>
          </div>

          <form onSubmit={handleSubmit} className="submit-premium-form">
            <div className="submit-grid-two">
              <div className="form-group">
                <label>Event Title</label>
                <input
                  name="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Event Date</label>
                <input
                  name="date"
                  placeholder="Enter event date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                name="location"
                placeholder="Enter event location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Short Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Write short description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label>Full Details</label>
              <textarea
                name="details"
                rows="6"
                placeholder="Write full event details"
                value={formData.details}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group submit-file-group">
              <label>Upload Image</label>
              <input type="file" name="image" accept="image/*" onChange={handleChange} />
            </div>

            {preview && (
              <div className="submit-preview-wrap">
                <img src={preview} alt="preview" className="admin-preview-image" />
              </div>
            )}

            {status && <p className="submit-success">{status}</p>}

            <button type="submit" className="admin-primary-btn submit-main-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Event'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default SubmitEvent