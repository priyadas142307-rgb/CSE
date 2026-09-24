import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { getCommittee, getCommitteeYears } from '../services/api'

function Committee() {
  const [years, setYears] = useState([])
  const [selectedYear, setSelectedYear] = useState('')
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadInitialData() {
      try {
        const yearsData = await getCommitteeYears()
        setYears(Array.isArray(yearsData) ? yearsData : [])

        const committeeData = await getCommittee()
        setSelectedYear(committeeData.selected_year || '')
        const allMembers = [
          ...(committeeData.featured_member ? [committeeData.featured_member] : []),
          ...(Array.isArray(committeeData.members) ? committeeData.members : []),
        ]
        setMembers(allMembers)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  async function handleYearChange(e) {
    const year = e.target.value
    setSelectedYear(year)
    setLoading(true)
    setError('')

    try {
      const committeeData = await getCommittee(year)
      const allMembers = [
        ...(committeeData.featured_member ? [committeeData.featured_member] : []),
        ...(Array.isArray(committeeData.members) ? committeeData.members : []),
      ]
      setMembers(allMembers)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="section-block committee-clean-filter-section">
        <div className="container">
          <div className="committee-clean-filter-shell">
            <div className="committee-clean-header">
              <span className="committee-clean-mini-title">COMMITTEE DIRECTORY</span>
              <h2>
                Explore By <span>Academic Year</span>
              </h2>
              <p>
                Select an academic year to view the corresponding committee members of MU CSE Society.
              </p>
            </div>

            <div className="committee-clean-select-wrap">
              <label htmlFor="committeeYearSelect" className="committee-clean-label">
                Select Academic Year
              </label>

              <div className="committee-clean-select-box">
                <select
                  id="committeeYearSelect"
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="committee-clean-select"
                >
                  <option value="">Choose Academic Year</option>
                  {years.map((year) => (
                    <option key={year.id} value={year.year_label}>
                      {year.year_label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block committee-clean-members-section">
        <div className="container">
          <div className="committee-clean-members-header">
            <span className="committee-clean-chip">
              {selectedYear ? `ACADEMIC YEAR ${selectedYear}` : 'COMMITTEE MEMBERS'}
            </span>
            <h3>Meet The Team</h3>
            <p>
              Dedicated student leaders working together to organize, manage, and grow the society.
            </p>
          </div>

          {loading && <p>Loading committee members...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && members.length === 0 && <p>No committee members found for this year.</p>}

          {!loading && !error && members.length > 0 && (
            <div className="card-grid">
              {members.map((item) => (
                <Card
                  key={item.id}
                  image={item.image}
                  title={item.name}
                  subtitle={item.title}
                  description={item.description}
                  facebook_url={item.facebook_url}
                  linkedin_url={item.linkedin_url}
                  link={`/committee/${item.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Committee