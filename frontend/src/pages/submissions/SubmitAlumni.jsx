import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitAlumni } from '../../services/api'

function SubmitAlumni() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    details: '',
    image: null,
    facebook_url: '',
    linkedin_url: '',
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
      const result = await submitAlumni(formData)
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
            <span className="submit-page-chip">Alumni Submission</span>
            <h1>Add Alumni Entry</h1>
            <p>Your submission will be reviewed by admin before publishing.</p>
          </div>

          <form onSubmit={handleSubmit} className="submit-premium-form">
            <div className="submit-grid-two">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Title / Designation</label>
                <input
                  name="title"
                  placeholder="Enter title or designation"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="submit-grid-two">
              <div className="form-group">
                <label>Facebook Profile Link</label>
                <input
                  type="url"
                  name="facebook_url"
                  placeholder="Paste Facebook profile link"
                  value={formData.facebook_url}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>LinkedIn Profile Link</label>
                <input
                  type="url"
                  name="linkedin_url"
                  placeholder="Paste LinkedIn profile link"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Short Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Write a short description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label>Full Details</label>
              <textarea
                name="details"
                rows="6"
                placeholder="Write full details"
                value={formData.details}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group submit-file-group">
              <label>Upload Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            {preview && (
              <div className="submit-preview-wrap">
                <img src={preview} alt="preview" className="admin-preview-image" />
              </div>
            )}

            {status && <p className="submit-success">{status}</p>}

            <button type="submit" className="admin-primary-btn submit-main-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Alumni'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default SubmitAlumni