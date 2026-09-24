import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createAlumni, getAlumni, updateAlumni } from '../services/api'

function AlumniForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    details: '',
    image: null,
    facebook_url: '',
    linkedin_url: '',
  })

  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadItem() {
      if (!id) return
      const data = await getAlumni()
      const item = Array.isArray(data) ? data.find((x) => String(x.id) === String(id)) : null
      if (!item) return

      setFormData({
        name: item.name || '',
        title: item.title || '',
        description: item.description || '',
        details: item.details || '',
        image: null,
        facebook_url: item.facebook_url || '',
        linkedin_url: item.linkedin_url || '',
      })
      setPreview(item.image || '')
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
        await updateAlumni(id, formData)
      } else {
        await createAlumni(formData)
      }

      navigate('/admin/alumni')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="admin-form-page">
      <div className="admin-page-header">
        <div>
          <h1>{id ? 'Edit Alumni' : 'Add Alumni'}</h1>
          <p>Fill in the alumni information below.</p>
        </div>
      </div>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" />
          </div>

          <div className="admin-form-group">
            <label>Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Software Engineer at Appify lab" />
          </div>
        </div>

        <div className="admin-form-grid">
        <div className="admin-form-group">
            <label>Facebook Link</label>
            <input type="url" name="facebook_url" value={formData.facebook_url} onChange={handleChange} />
        </div>

        <div className="admin-form-group">
            <label>LinkedIn Link</label>
            <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} />
        </div>
        </div>

        <div className="admin-form-group">
          <label>Description</label>
          <textarea rows="4" name="description" value={formData.description} onChange={handleChange} placeholder="Enter alumni description"></textarea>
        </div>

        <div className="admin-form-group">
          <label>Details</label>
          <textarea rows="6" name="details" value={formData.details} onChange={handleChange} placeholder="Enter alumni details"></textarea>
        </div>

        <div className="admin-form-group">
          <label>Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
        </div>

        {preview && <img src={preview} alt="preview" className="admin-preview-image" />}

        <div className="admin-form-actions">
          <button type="button" className="admin-secondary-btn" onClick={() => navigate('/admin/alumni')}>
            Cancel
          </button>
          <button type="submit" className="admin-primary-btn" disabled={loading}>
            {loading ? 'Saving...' : id ? 'Update Alumni' : 'Create Alumni'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AlumniForm