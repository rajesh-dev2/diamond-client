import { useState } from 'react'
import './style.css'

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    password: '',
    newPassword: '',
    newPasswordConfirm: '',
  })

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="change-password-page">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Change Password</h4>
        </div>
        <div className="card-body">
          <div className="report-form">
            <form onSubmit={handleSubmit}>
              <div className="row row10">
                <div className="mb-3 position-relative col-md-6">
                  <label className="form-label">Current Password:</label>
                  <input 
                    name="password" 
                    type="password" 
                    className="form-control" 
                    placeholder="Enter Current password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row row10">
                <div className="mb-3 position-relative col-md-6">
                  <label className="form-label">New Password:</label>
                  <input 
                    name="newPassword" 
                    type="password" 
                    className="form-control" 
                    placeholder="Enter New Password"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row row10">
                <div className="mb-4 position-relative col-md-6">
                  <label className="form-label">Confirm Password:</label>
                  <input 
                    name="newPasswordConfirm" 
                    type="password" 
                    className="form-control" 
                    placeholder="Confirm New Password"
                    value={formData.newPasswordConfirm}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row row10">
                <div className="mb-3 col-md-6">
                  <button type="submit" className="btn btn-primary btn-block w-100">
                    Change Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
