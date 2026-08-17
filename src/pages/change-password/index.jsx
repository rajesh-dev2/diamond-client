import { useState } from 'react'
import { message } from 'antd'
import { useChangePasswordMutation } from '../../store/api/authApi'
import './style.css'

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    password: '',
    newPassword: '',
    newPasswordConfirm: '',
  })

  const [changePassword, { isLoading }] = useChangePasswordMutation()

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.password?.trim()) {
      message.error('Please enter your current password')
      return
    }
    if (!formData.newPassword?.trim()) {
      message.error('Please enter your new password')
      return
    }
    if (!formData.newPasswordConfirm?.trim()) {
      message.error('Please confirm your new password')
      return
    }
    if (formData.newPassword !== formData.newPasswordConfirm) {
      message.error('New password and confirm password do not match')
      return
    }

    try {
      const res = await changePassword({
        currentPassword: formData.password,
        newPassword: formData.newPassword,
      }).unwrap()

      message.success(res?.message || 'Password changed successfully')
      setFormData({
        password: '',
        newPassword: '',
        newPasswordConfirm: '',
      })
    } catch (err) {
      message.error(err?.data?.message || err?.error || 'Failed to change password')
    }
  }

  return (
    <div className="report-page change-password-page">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Change Password</h4>
        </div>
        <div className="card-body">
          <div className="report-form">
            <form onSubmit={handleSubmit}>
              <div className="row row10">
                <div className="mb-1 position-relative col-md-6">
                  <label className="form-label">Current Password:</label>
                  <input 
                    name="password" 
                    type="password" 
                    className="form-control" 
                    placeholder="Enter Current password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                </div>
              </div>
              <div className="row row10">
                <div className="mb-1 position-relative col-md-6">
                  <label className="form-label">New Password:</label>
                  <input 
                    name="newPassword" 
                    type="password" 
                    className="form-control" 
                    placeholder="Enter New Password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
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
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <div className="row row10">
                <div className="mb-3 col-md-6">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-submit w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Changing Password...' : 'Change Password'}
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

