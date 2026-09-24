import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createCommitteeYear,
  deleteCommitteeMember,
  deleteCommitteeYear,
  getCommittee,
  getCommitteeYears,
} from '../services/api'

function ManageCommittee() {
  const [years, setYears] = useState([])
  const [selectedYear, setSelectedYear] = useState('')
  const [members, setMembers] = useState([])
  const [newYear, setNewYear] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const navigate = useNavigate()

  async function loadYears() {
    const data = await getCommitteeYears()
    setYears(Array.isArray(data) ? data : [])
  }

  async function loadMembers(yearLabel = '') {
    const data = await getCommittee(yearLabel)
    const combined = [
      ...(data.featured_member ? [data.featured_member] : []),
      ...(Array.isArray(data.members) ? data.members : []),
    ]
    setMembers(combined)
    setSelectedYear(data.selected_year || yearLabel || '')
  }

  useEffect(() => {
    async function init() {
      await loadYears()
      await loadMembers()
    }

    init()
  }, [])

  async function handleYearCreate(e) {
    e.preventDefault()
    await createCommitteeYear({
      year_label: newYear,
      sort_order: sortOrder,
    })
    setNewYear('')
    setSortOrder('0')
    loadYears()
  }

  async function handleMemberDelete(id) {
    if (!window.confirm('Delete this member?')) return
    await deleteCommitteeMember(id)
    loadMembers(selectedYear)
  }

  async function handleYearDelete(id) {
    if (!window.confirm('Delete this committee year?')) return
    await deleteCommitteeYear(id)
    await loadYears()
    await loadMembers()
  }

  return (
    <section className="admin-page-section">
      <div className="admin-page-header">
        <div>
          <h1>Manage Committee</h1>
          <p>Manage academic years and committee members.</p>
        </div>
        <button
          className="admin-primary-btn"
          onClick={() => navigate('/admin/committee/add')}
        >
          + Add Member
        </button>
      </div>

      <div className="admin-panel-card">
        <h3>Create Academic Year</h3>
        <form className="admin-inline-form" onSubmit={handleYearCreate}>
          <input
            type="text"
            placeholder="Year label, e.g. 2025-26"
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
          />
          <input
            type="number"
            placeholder="Sort order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
          <button type="submit" className="admin-primary-btn">Add Year</button>
        </form>
      </div>

      <div className="admin-panel-card">
        <h3>Committee Years</h3>
        <div className="admin-chip-wrap">
          {years.map((year) => (
            <div className="admin-year-chip" key={year.id}>
              <button
                className={selectedYear === year.year_label ? 'active' : ''}
                onClick={() => loadMembers(year.year_label)}
              >
                {year.year_label}
              </button>
              <span onClick={() => handleYearDelete(year.id)}>✕</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-table-wrap">
        {members.map((item) => (
          <div className="admin-table-row" key={item.id}>
            <img src={item.image} alt={item.name} className="admin-thumb" />
            <div className="admin-table-content">
              <h3>{item.name}</h3>
              <p>{item.title} • {item.academic_year}</p>
            </div>
            <div className="admin-table-actions">
              <button onClick={() => navigate(`/admin/committee/edit/${item.id}`)}>Edit</button>
              <button className="danger" onClick={() => handleMemberDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ManageCommittee