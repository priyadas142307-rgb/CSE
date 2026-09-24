import { useState } from 'react'
import { loginMember, registerMember } from '../services/api'

function Login() {
  const [activeTab, setActiveTab] = useState('login')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageName, setImageName] = useState('')

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  })

  const [registerData, setRegisterData] = useState({
    full_name: '',
    student_id: '',
    batch: '',
    designation: '',
    year_label: '',
    details: '',
    username: '',
    email: '',
    password: '',
    image: null,
    facebook_url: '',
    linkedin_url: '',
  })

  function handleLoginChange(e) {
    const { name, value } = e.target
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleRegisterChange(e) {
    const { name, value, files } = e.target

    if (name === 'image') {
      const file = files && files[0] ? files[0] : null
      setRegisterData((prev) => ({
        ...prev,
        image: file,
      }))
      setImageName(file ? file.name : '')
      return
    }

    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function validateUsername(username) {
    // start with at least 3 letters, and contain at least 2 digits overall
    const startsWithThreeLetters = /^[A-Za-z]{3,}/.test(username)
    const digitCount = (username.match(/\d/g) || []).length
    return startsWithThreeLetters && digitCount >= 2
  }

  function validatePassword(password) {
    const minLength = password.length >= 6
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)

    return minLength && hasUppercase && hasNumber && hasSpecial
  }

  async function handleLoginSubmit(e) {
    e.preventDefault()
    setStatus('')
    setError('')
    setLoading(true)

    try {
      const result = await loginMember(loginData)

      localStorage.setItem('cseSocietyUser', JSON.stringify(result.user))
      window.dispatchEvent(new Event('cse-auth-updated'))

      setStatus(result.message)

      setTimeout(() => {
        if (result.user.is_staff || result.user.is_superuser) {
          window.location.href = 'http://127.0.0.1:5173/admin'
        } else {
          window.location.href = 'http://127.0.0.1:5173/'
        }
      }, 300)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function validateStudentId(studentId) {
  return /^\d{3}-115-\d{3}$/.test(studentId)
}

function validateBatch(batch) {
  return /^\d+$/.test(batch)
}

function validateUsername(username) {
  const startsWithThreeLetters = /^[A-Za-z]{3,}/.test(username)
  const digitCount = (username.match(/\d/g) || []).length
  return startsWithThreeLetters && digitCount >= 2
}

function validatePassword(password) {
  const minLength = password.length >= 6
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  return minLength && hasUppercase && hasNumber && hasSpecial
}

 async function handleRegisterSubmit(e) {
  e.preventDefault()
  setStatus('')
  setError('')

  if (!validateStudentId(registerData.student_id)) {
    setError('Student ID must be in this format: 123-115-456')
    return
  }

  if (!validateBatch(registerData.batch)) {
    setError('Batch must contain numbers only. Example: 58')
    return
  }

  if (!validateUsername(registerData.username)) {
    setError('Username must start with at least 3 letters and contain at least 2 numbers. Example: abc12')
    return
  }

  if (!validatePassword(registerData.password)) {
    setError('Password must be at least 6 characters and include 1 uppercase letter, 1 number, and 1 special character.')
    return
  }

  setLoading(true)

  try {
    const result = await registerMember(registerData)
    setStatus(result.message)
    setActiveTab('login')
    setRegisterData({
      full_name: '',
      student_id: '',
      batch: '',
      designation: '',
      year_label: '',
      details: '',
      username: '',
      email: '',
      password: '',
      image: null,
      facebook_url: '',
      linkedin_url: '',
    })
    setImageName('')
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

  return (
    <section className="login-auth-page">
      <div className="container login-auth-layout">
        <div className="login-auth-info-panel">
          <span className="login-auth-mini-title">MEMBER ACCESS</span>
          <h1>
            Login Or <span>Create Account</span>
          </h1>
          <p>
            Access society features, create your member account, and manage your club activities
            with a clean and secure login experience.
          </p>

          <div className="login-auth-stat-row">
            <div className="login-auth-stat-box">
              <strong>Member</strong>
              <span>Authentication</span>
            </div>
            <div className="login-auth-stat-box">
              <strong>Profile</strong>
              <span>Creation</span>
            </div>
            <div className="login-auth-stat-box">
              <strong>Quick</strong>
              <span>Access Menu</span>
            </div>
          </div>
        </div>

        <div className="login-auth-form-card">
          <div className="login-auth-tab-row">
            <button
              type="button"
              className={activeTab === 'login' ? 'login-auth-tab active' : 'login-auth-tab'}
              onClick={() => {
                setActiveTab('login')
                setStatus('')
                setError('')
              }}
            >
              Login
            </button>

            <button
              type="button"
              className={activeTab === 'register' ? 'login-auth-tab active' : 'login-auth-tab'}
              onClick={() => {
                setActiveTab('register')
                setStatus('')
                setError('')
              }}
            >
              Create Account
            </button>
          </div>

          {status && <p className="login-auth-success">{status}</p>}
          {error && <p className="login-auth-error">{error}</p>}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  placeholder="Enter your username"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="primary-btn reference-primary-btn full-btn"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="login-register-form">
              <div className="login-auth-grid-two">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={registerData.full_name}
                    onChange={handleRegisterChange}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="form-group">
                  <label>Student ID</label>
                  <input
                    type="text"
                    name="student_id"
                    value={registerData.student_id}
                    onChange={handleRegisterChange}
                    placeholder="Enter student ID"
                  />
                </div>
              </div>

              <div className="login-auth-grid-two">
                <div className="form-group">
                  <label>Batch</label>
                  <input
                    type="text"
                    name="batch"
                    value={registerData.batch}
                    onChange={handleRegisterChange}
                    placeholder="Enter batch"
                  />
                </div>

                <div className="form-group">
                  <label>Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={registerData.designation}
                    onChange={handleRegisterChange}
                    placeholder="Enter designation"
                  />
                </div>
              </div>

              <div className="login-auth-grid-two">
                <div className="form-group">
                  <label>Year Label</label>
                  <input
                    type="text"
                    name="year_label"
                    value={registerData.year_label}
                    onChange={handleRegisterChange}
                    placeholder="Example: 2025-26"
                  />
                </div>

                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                    placeholder="Example: abc12"
                  />
                  <small className="login-auth-helper">
                    Must start with 3+ letters and contain 2+ numbers
                  </small>
                </div>
              </div>

              <div className="login-auth-grid-two">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="Create password"
                  />
                  <small className="login-auth-helper">
                    Minimum 6 chars, 1 uppercase, 1 number, 1 special character
                  </small>
                </div>
              </div>

              <div className="login-auth-grid-two login-auth-grid-links">
                <div className="form-group">
                  <label>Facebook Link (Optional)</label>
                  <input
                    type="url"
                    name="facebook_url"
                    value={registerData.facebook_url}
                    onChange={handleRegisterChange}
                    placeholder="Paste Facebook profile link"
                  />
                </div>

                <div className="form-group">
                  <label>LinkedIn Link (Optional)</label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={registerData.linkedin_url}
                    onChange={handleRegisterChange}
                    placeholder="Paste LinkedIn profile link"
                  />
                </div>
              </div>

              <div className="form-group login-auth-full-width">
                <label>Profile Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleRegisterChange}
                />
                {imageName && <small className="login-auth-file-name">{imageName}</small>}
              </div>

              <div className="form-group login-auth-full-width">
                <label>Details</label>
                <textarea
                  rows="4"
                  name="details"
                  value={registerData.details}
                  onChange={handleRegisterChange}
                  placeholder="Write short details about yourself"
                ></textarea>
              </div>

              <button
                type="submit"
                className="primary-btn reference-primary-btn full-btn"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default Login