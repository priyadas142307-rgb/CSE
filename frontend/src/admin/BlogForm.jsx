import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createBlog, getBlogDetails, updateBlog } from '../services/api'

function BlogForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    details: '',
    image: null,
  })

  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadItem() {
      if (!id) return
      const data = await getBlogDetails(id)
      setFormData({
        title: data.title || '',
        date: data.date || '',
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
        await updateBlog(id, formData)
      } else {
        await createBlog(formData)
      }

      navigate('/admin/blogs')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="admin-form-page">
      <div className="admin-page-header">
        <div>
          <h1>{id ? 'Edit Blog' : 'Add Blog'}</h1>
          <p>Fill in the blog information below.</p>
        </div>
      </div>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label>Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter blog title" />
          </div>

          <div className="admin-form-group">
            <label>Date</label>
            <input type="text" name="date" value={formData.date} onChange={handleChange} placeholder="Example: 12 April 2026" />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Description</label>
          <textarea rows="4" name="description" value={formData.description} onChange={handleChange} placeholder="Enter blog description"></textarea>
        </div>

        <div className="admin-form-group">
          <label>Details</label>
          <textarea rows="6" name="details" value={formData.details} onChange={handleChange} placeholder="Enter blog details"></textarea>
        </div>

        <div className="admin-form-group">
          <label>Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
        </div>

        {preview && <img src={preview} alt="preview" className="admin-preview-image" />}

        <div className="admin-form-actions">
          <button type="button" className="admin-secondary-btn" onClick={() => navigate('/admin/blogs')}>
            Cancel
          </button>
          <button type="submit" className="admin-primary-btn" disabled={loading}>
            {loading ? 'Saving...' : id ? 'Update Blog' : 'Create Blog'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default BlogForm