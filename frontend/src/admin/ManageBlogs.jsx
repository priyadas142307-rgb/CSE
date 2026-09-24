import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteBlog, getBlogs } from '../services/api'

function ManageBlogs() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  async function loadData() {
    try {
      const data = await getBlogs()
      setItems(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleDelete(id) {
    if (!window.confirm('Delete this blog?')) return
    await deleteBlog(id)
    loadData()
  }

  return (
    <section className="admin-page-section">
      <div className="admin-page-header">
        <div>
          <h1>Manage Blogs</h1>
          <p>Create, edit and delete blog content.</p>
        </div>
        <button className="admin-primary-btn" onClick={() => navigate('/admin/blogs/add')}>
          + Add Blog
        </button>
      </div>

      {loading ? <p>Loading blogs...</p> : (
        <div className="admin-table-wrap">
          {items.map((item) => (
            <div className="admin-table-row" key={item.id}>
              <img src={item.image} alt={item.title} className="admin-thumb" />
              <div className="admin-table-content">
                <h3>{item.title}</h3>
                <p>{item.date}</p>
              </div>
              <div className="admin-table-actions">
                <button onClick={() => navigate(`/admin/blogs/edit/${item.id}`)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default ManageBlogs