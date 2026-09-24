import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteNotice, getNotices } from '../services/api'

function ManageNotices() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  async function loadData() {
    try {
      const data = await getNotices()
      setItems(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleDelete(id) {
    if (!window.confirm('Delete this notice?')) return
    await deleteNotice(id)
    loadData()
  }

  return (
    <section className="admin-page-section">
      <div className="admin-page-header">
        <div>
          <h1>Manage Notices</h1>
          <p>Create, edit and delete notice content.</p>
        </div>
        <button className="admin-primary-btn" onClick={() => navigate('/admin/notices/add')}>
          + Add Notice
        </button>
      </div>

      {loading ? <p>Loading notices...</p> : (
        <div className="admin-table-wrap">
          {items.map((item) => (
            <div className="admin-table-row" key={item.id}>
              <img src={item.image} alt={item.title} className="admin-thumb" />
              <div className="admin-table-content">
                <h3>{item.title}</h3>
                <p>{item.date}</p>
              </div>
              <div className="admin-table-actions">
                <button onClick={() => navigate(`/admin/notices/edit/${item.id}`)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default ManageNotices