import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../services/api'

function ChangePassword() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function validatePassword(password) {
    const minLength = password.length >= 6
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[^A-Za-z0-9]/.test(password)

    return minLength && hasUppercase && hasNumber && hasSpecial
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setError('')

    if (formData.new_password !== formData.confirm_password) {
      setError('New password and confirm password do not match.')
      return
    }

    if (!validatePassword(formData.new_password)) {
      setError(
        'New password must be at least 6 characters and include 1 uppercase letter, 1 number, and 1 special character.'
      )
      return
    }

    setSaving(true)

    try {
      const data = await changePassword({
        current_password: formData.old_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      })

      setMessage(data.message || 'Password changed successfully.')

      setTimeout(() => {
        navigate('/profile')
      }, 1200)
    } catch (err) {
      setError(err.message || 'Failed to change password.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="password-page-section">
      <div className="container">
        <div className="password-page-wrapper">
          <div className="password-page-card">
            <div className="password-page-left">
              <div className="password-chip">Security</div>
              <h1>Change Password</h1>
              <p>
                Update your password to keep your account safe and secure.
              </p>

              <div className="password-visual-box">
                <div className="password-lock-circle">
                  <span>🔒</span>
                </div>
              </div>
            </div>

            <div className="password-page-right">
              {message && <div className="password-success-box">{message}</div>}
              {error && <div className="password-error-box">{error}</div>}

              <form onSubmit={handleSubmit} className="password-form-box">
                <div className="password-input-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="old_password"
                    value={formData.old_password}
                    onChange={handleChange}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="password-input-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                  <small className="password-helper-text">
                    Minimum 6 characters, 1 uppercase, 1 number, 1 special character
                  </small>
                </div>

                <div className="password-input-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="password-form-actions">
                  <button type="submit" className="password-primary-btn" disabled={saving}>
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>

                  <button
                    type="button"
                    className="password-secondary-btn"
                    onClick={() => navigate('/profile')}
                  >
                    Back to Profile
                  </button>
                </div>
              </form>
            </div>

            <div className="password-bg-shape password-shape-1"></div>
            <div className="password-bg-shape password-shape-2"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChangePassword