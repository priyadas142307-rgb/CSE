import { useEffect, useState } from 'react'
import { approvePending, getPendingSubmissions, rejectPending } from '../services/api'

function SubmissionBlock({ title, items, type, refresh }) {
  return (
    <div className="admin-panel-card">
      <h3>{title}</h3>

      {items.length === 0 ? (
        <p>No pending {type} submissions.</p>
      ) : (
        <div className="admin-table-wrap">
          {items.map((item) => (
            <div className="admin-table-row" key={item.id}>
              <img src={item.image} alt={item.title || item.name} className="admin-thumb" />
              <div className="admin-table-content">
                <h3>{item.title || item.name}</h3>
                <p>By: {item.submitted_by || 'Unknown'}</p>
              </div>
              <div className="admin-table-actions">
                <button
                  onClick={async () => {
                    await approvePending(type, item.id)
                    refresh()
                  }}
                >
                  Approve
                </button>
                <button
                  className="danger"
                  onClick={async () => {
                    await rejectPending(type, item.id)
                    refresh()
                  }}
                >
                  Reject
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

  async function loadData() {
    const result = await getPendingSubmissions()
    setData(result)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <section className="admin-page-section">
      <div className="admin-page-header">
        <div>
          <h1>Pending Submissions</h1>
          <p>Approve or reject user submitted content.</p>
        </div>
      </div>

      <SubmissionBlock title="Pending Events" items={data.events || []} type="events" refresh={loadData} />
      <SubmissionBlock title="Pending Notices" items={data.notices || []} type="notices" refresh={loadData} />
      <SubmissionBlock title="Pending Blogs" items={data.blogs || []} type="blogs" refresh={loadData} />
      <SubmissionBlock title="Pending Alumni" items={data.alumni || []} type="alumni" refresh={loadData} />
    </section>
  )
}

export default ManageSubmissions