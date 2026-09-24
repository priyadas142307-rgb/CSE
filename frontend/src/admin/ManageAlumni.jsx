import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteAlumni, getAlumni } from '../services/api'

function ManageAlumni() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  async function loadData() {
    try {
      const data = await getAlumni()
      setItems(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleDelete(id) {
    if (!window.confirm('Delete this alumni item?')) return
    await deleteAlumni(id)
    loadData()
  }

  return (
    <section className="admin-page-section">
      <div className="admin-page-header">
        <div>
          <h1>Manage Alumni</h1>
          <p>Create, edit and delete alumni entries.</p>
        </div>
        <button className="admin-primary-btn" onClick={() => navigate('/admin/alumni/add')}>
          + Add Alumni
        </button>
      </div>

      {loading ? <p>Loading alumni...</p> : (
        <div className="admin-table-wrap">
          {items.map((item) => (
            <div className="admin-table-row" key={item.id}>
              <img src={item.image} alt={item.name} className="admin-thumb" />
              <div className="admin-table-content">
                <h3>{item.name}</h3>
                <p>{item.title}</p>
              </div>
              <div className="admin-table-actions">
                <button onClick={() => navigate(`/admin/alumni/edit/${item.id}`)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default ManageAlumni