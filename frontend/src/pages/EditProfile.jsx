import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, updateProfile } from '../services/api'

function EditProfile() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    full_name: '',
    student_id: '',
    batch: '',
    designation: '',
    year_label: '',
    details: '',
    facebook_url: '',
    linkedin_url: '',
    image: null,
  })

  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser()

        if (data.authenticated && data.user) {
          setFormData({
            full_name: data.user.full_name || '',
            student_id: data.user.student_id || '',
            batch: data.user.batch || '',
            designation: data.user.designation || '',
            year_label: data.user.year_label || '',
            details: data.user.details || '',
            facebook_url: data.user.facebook_url || '',
            linkedin_url: data.user.linkedin_url || '',
            image: null,
          })

          if (data.user.image) {
            setPreview(data.user.image)
          }
        } else {
          setError('Please login first.')
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  function validateStudentId(studentId) {
    return /^\d{3}-115-\d{3}$/.test(studentId)
  }

  function validateBatch(batch) {
    return /^\d+$/.test(batch)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))
      setPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    if (!validateStudentId(formData.student_id)) {
      setError('Student ID must be in this format: 123-115-456')
      setSaving(false)
      return
    }

    if (!validateBatch(formData.batch)) {
      setError('Batch must contain numbers only. Example: 58')
      setSaving(false)
      return
    }

    try {
      const payload = { ...formData }
      const data = await updateProfile(payload)

      setMessage(data.message || 'Profile updated successfully.')

      setTimeout(() => {
        navigate('/profile')
      }, 1200)
    } catch (err) {
      setError(err.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <section className="profile-form-page">
        <div className="container">
          <div className="profile-form-status-card">Loading profile data...</div>
        </div>
      </section>
    )
  }

  if (error && !formData.full_name) {
    return (
      <section className="profile-form-page">
        <div className="container">
          <div className="profile-form-status-card">{error}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="profile-form-page">
      <div className="container">
        <div className="profile-form-wrapper">
          <div className="profile-form-card">
            <div className="profile-form-left">
              <div className="profile-form-chip">Edit Profile</div>
              <h1>Update Your Profile</h1>
              <p>
                Keep your profile information updated so your member card looks
                professional and complete.
              </p>

              <div className="profile-form-preview-box">
                <div className="profile-form-image-shell">
                  {preview ? (
                    <img src={preview} alt="Preview" className="profile-form-preview-image" />
                  ) : (
                    <div className="profile-form-preview-placeholder">U</div>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-form-right">
              {message && <div className="profile-form-success">{message}</div>}
              {error && <div className="profile-form-error">{error}</div>}

              <form onSubmit={handleSubmit} className="profile-form-grid">
                <div className="profile-input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="profile-input-group">
                  <label>Student ID</label>
                  <input
                    type="text"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    placeholder="Example: 123-115-456"
                  />
                  <small className="profile-form-helper">
                    Format: 123-115-456
                  </small>
                </div>

                <div className="profile-input-group">
                  <label>Batch</label>
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    placeholder="Example: 58"
                  />
                  <small className="profile-form-helper">
                    Numbers only
                  </small>
                </div>

                <div className="profile-input-group">
                  <label>Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Enter designation"
                  />
                </div>

                <div className="profile-input-group">
                  <label>Year Label</label>
                  <input
                    type="text"
                    name="year_label"
                    value={formData.year_label}
                    onChange={handleChange}
                    placeholder="Enter year label"
                  />
                </div>

                <div className="profile-input-group">
                  <label>Facebook URL</label>
                  <input
                    type="text"
                    name="facebook_url"
                    value={formData.facebook_url}
                    onChange={handleChange}
                    placeholder="Enter Facebook link"
                  />
                </div>

                <div className="profile-input-group">
                  <label>LinkedIn URL</label>
                  <input
                    type="text"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    placeholder="Enter LinkedIn link"
                  />
                </div>

                <div className="profile-input-group">
                  <label>Profile Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="profile-input-group profile-textarea-group">
                  <label>Details</label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    placeholder="Write some details about yourself"
                    rows="5"
                  />
                </div>

                <div className="profile-form-actions">
                  <button type="submit" className="profile-save-btn" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>

                  <button
                    type="button"
                    className="profile-cancel-btn"
                    onClick={() => navigate('/profile')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div className="profile-form-bg shape-a"></div>
            <div className="profile-form-bg shape-b"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EditProfile