import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createEvent, getEventDetails, updateEvent } from '../services/api'

function EventForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    details: '',
    image: null,
  })

  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadItem() {
      if (!id) return

      const data = await getEventDetails(id)
      setFormData({
        title: data.title || '',
        date: data.date || '',
        location: data.location || '',
        description: data.description || '',
        details: data.details || '',
        image: null,
      })
      setPreview(data.image || '')
    }

    loadItem()
  }, [id])

  function handleChange(e) {
    const { name, value, files } = e.target

    if (name === 'image') {
      const file = files && files[0] ? files[0] : null
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
      if (id) {
        await updateEvent(id, formData)
      } else {
        await createEvent(formData)
      }

      navigate('/admin/events')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="admin-form-page">
      <div className="admin-page-header">
        <div>
          <h1>{id ? 'Edit Event' : 'Add Event'}</h1>
          <p>Fill in the event information below.</p>
        </div>
      </div>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label>Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder='Enter Event Title'/>
          </div>

          <div className="admin-form-group">
            <label>Date</label>
            <input type="text" name="date" value={formData.date} onChange={handleChange} placeholder="Example: 12 May 2026" />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter event location" />
        </div>

        <div className="admin-form-group">
          <label>Description</label>
          <textarea rows="4" name="description" value={formData.description} onChange={handleChange} placeholder="Enter event description"></textarea>
        </div>

        <div className="admin-form-group">
          <label>Details</label>
          <textarea rows="6" name="details" value={formData.details} onChange={handleChange} placeholder="Enter event details"></textarea>
        </div>

        <div className="admin-form-group">
          <label>Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
        </div>

        {preview && <img src={preview} alt="preview" className="admin-preview-image" />}

        <div className="admin-form-actions">
          <button type="button" className="admin-secondary-btn" onClick={() => navigate('/admin/events')}>
            Cancel
          </button>
          <button type="submit" className="admin-primary-btn" disabled={loading}>
            {loading ? 'Saving...' : id ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default EventForm