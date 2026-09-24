import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createCommitteeMember,
  getCommittee,
  getCommitteeYears,
  updateCommitteeMember,
} from '../services/api'

function CommitteeForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [years, setYears] = useState([])
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    academic_year_id: '',
    name: '',
    title: '',
    description: '',
    details: '',
    display_order: '0',
    image: null,
    facebook_url: '',
    linkedin_url: '',
  })

  useEffect(() => {
    async function loadYears() {
      const yearsData = await getCommitteeYears()
      setYears(Array.isArray(yearsData) ? yearsData : [])
    }

    loadYears()
  }, [])

  useEffect(() => {
    async function loadItem() {
      if (!id) return

      const yearsData = await getCommitteeYears()
      let foundItem = null

      for (const year of yearsData) {
        const data = await getCommittee(year.year_label)
        const combined = [
          ...(data.featured_member ? [data.featured_member] : []),
          ...(Array.isArray(data.members) ? data.members : []),
        ]
        const matched = combined.find((item) => String(item.id) === String(id))
        if (matched) {
          foundItem = matched
          break
        }
      }

      if (!foundItem) return

      setFormData({
        academic_year_id: foundItem.academic_year_id || '',
        name: foundItem.name || '',
        title: foundItem.title || '',
        description: foundItem.description || '',
        details: foundItem.details || '',
        display_order: String(foundItem.display_order || 0),
        image: null,
        facebook_url: foundItem.facebook_url || '',
        linkedin_url: foundItem.linkedin_url || '',
      })
      setPreview(foundItem.image || '')
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
        await updateCommitteeMember(id, formData)
      } else {
        await createCommitteeMember(formData)
      }

      navigate('/admin/committee')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="admin-form-page">
      <div className="admin-page-header">
        <div>
          <h1>{id ? 'Edit Committee Member' : 'Add Committee Member'}</h1>
          <p>Fill in the committee member information below.</p>
        </div>
      </div>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label>Academic Year</label>
            <select name="academic_year_id" value={formData.academic_year_id} onChange={handleChange}>
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.year_label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Display Order</label>
            <input type="number" name="display_order" value={formData.display_order} onChange={handleChange} />
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder='Enter Full Name' />
          </div>

          <div className="admin-form-group">
            <label>Designation</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Example: President" />
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
          <textarea rows="4" name="description" value={formData.description} onChange={handleChange} placeholder="Enter committee member description"></textarea>
        </div>

        <div className="admin-form-group">
          <label>Details</label>
          <textarea rows="6" name="details" value={formData.details} onChange={handleChange} placeholder="Enter committee member details"></textarea>
        </div>

        <div className="admin-form-group">
          <label>Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
        </div>

        {preview && <img src={preview} alt="preview" className="admin-preview-image" />}

        <div className="admin-form-actions">
          <button type="button" className="admin-secondary-btn" onClick={() => navigate('/admin/committee')}>
            Cancel
          </button>
          <button type="submit" className="admin-primary-btn" disabled={loading}>
            {loading ? 'Saving...' : id ? 'Update Member' : 'Create Member'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default CommitteeForm