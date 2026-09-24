import { useEffect, useState } from 'react'

const API = "http://127.0.0.1:8000/api"

function ManageUsers() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch(`${API}/admin/users/`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  return (
    <div>
      <h1>Users</h1>

      <div className="table">
        {users.map(u => (
          <div className="row" key={u.id}>
            <div>{u.full_name}</div>
            <div>{u.username}</div>
            <div>{u.email}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageUsers