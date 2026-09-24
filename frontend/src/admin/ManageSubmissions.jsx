import { useCallback, useEffect, useState } from 'react'
import { approvePending, getPendingSubmissions, rejectPending } from '../services/api'

function SubmissionBlock({ title, items, type, refresh }) {
  const [actingId, setActingId] = useState(null)

  const handleApprove = async (id) => {
    try {
      setActingId(id)
      await approvePending(type, id)
      refresh()
    } catch (err) {
      alert(err.message || 'Failed to approve submission.')
    } finally {
      setActingId(null)
    }
  }

  const handleReject = async (id) => {
    if (!window.confirm(`Are you sure you want to reject this ${type.slice(0, -1)} submission?`)) {
      return
    }
    try {
      setActingId(id)
      await rejectPending(type, id)
      refresh()
    } catch (err) {
      alert(err.message || 'Failed to reject submission.')
    } finally {
      setActingId(null)
    }
  }

  return (
    <div className="admin-panel-card">
      <h3>{title}</h3>

      {items.length === 0 ? (
        <p style={{ color: '#64748b', marginTop: '10px' }}>No pending {type} submissions.</p>
      ) : (
        <div className="admin-table-wrap" style={{ marginTop: '14px' }}>
          {items.map((item) => (
            <div className="admin-table-row" key={item.id}>
              {item.image ? (
                <img src={item.image} alt={item.title || item.name} className="admin-thumb" />
              ) : (
                <div className="admin-thumb" style={{ background: '#f1f5f9', display: 'grid', placeItems: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                  No Image
                </div>
              )}
              <div className="admin-table-content">
                <h3>{item.title || item.name}</h3>
                <p>By: {item.submitted_by || 'Unknown'} {item.date ? `• Date: ${item.date}` : ''}</p>
              </div>
              <div className="admin-table-actions">
                <button
                  type="button"
                  disabled={actingId === item.id}
                  onClick={() => handleApprove(item.id)}
                >
                  {actingId === item.id ? 'Processing...' : 'Approve'}
                </button>
                <button
                  type="button"
                  className="danger"
                  disabled={actingId === item.id}
                  onClick={() => handleReject(item.id)}
                >
                  {actingId === item.id ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ManageSubmissions() {
  const [data, setData] = useState({
    events: [],
    notices: [],
    blogs: [],
    alumni: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const result = await getPendingSubmissions()
      if (result) {
        setData({
          events: result.events || [],
          notices: result.notices || [],
          blogs: result.blogs || [],
          alumni: result.alumni || [],
        })
      }
    } catch (err) {
      setError(err.message || 'Failed to load pending submissions.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <section className="admin-page-section">
      <div className="admin-page-header">
        <div>
          <h1>Pending Submissions</h1>
          <p>Approve or reject member submitted events, notices, blogs, and alumni profiles.</p>
        </div>
        <button type="button" className="admin-secondary-btn" onClick={loadData} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh List'}
        </button>
      </div>

      {error && <div className="admin-error-box">{error}</div>}

      <SubmissionBlock title="Pending Events" items={data.events || []} type="events" refresh={loadData} />
      <SubmissionBlock title="Pending Notices" items={data.notices || []} type="notices" refresh={loadData} />
      <SubmissionBlock title="Pending Blogs" items={data.blogs || []} type="blogs" refresh={loadData} />
      <SubmissionBlock title="Pending Alumni" items={data.alumni || []} type="alumni" refresh={loadData} />
    </section>
  )
}

export default ManageSubmissions