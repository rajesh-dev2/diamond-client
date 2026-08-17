import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { message } from 'antd'
import { setCredentials } from '../../store/authSlice'
import { useLoginMutation } from '../../store/api/authApi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faKey, faSignInAlt, faHandPointDown } from '@fortawesome/free-solid-svg-icons'
import logo from '../../assets/brand-logo/logo.png'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [login, { isLoading }] = useLoginMutation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!username || !password) {
      message.error('Please enter username and password')
      return
    }

    try {
      const result = await login({ username, password }).unwrap()
      dispatch(setCredentials({ token: result.token, user: result.user }))
      navigate('/home', { replace: true })
    } catch (err) {
      message.error(err?.data?.message || 'Invalid Username or Password')
    }
  }

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#07131b] via-[#113645] to-[#184c5f] pb-[70px] relative font-sans">
      <div className="w-full max-w-[380px] px-[15px] flex flex-col items-center">
        <div className="mb-6 text-center">
          <Link to="/">
            <img src={logo} alt="IceBook Logo" className="max-w-[250px] h-auto block" />
          </Link>
        </div>
        <div className="bg-white w-full p-6 rounded-md shadow-2xl mt-4">
          <h4 className="text-[19px] font-bold text-[#212529] mb-5 flex items-center justify-center gap-1.5 text-center">
            Login <FontAwesomeIcon icon={faHandPointDown} />
          </h4>

          <form onSubmit={handleLogin}>
            <div className="mb-4 flex relative">
              <input 
                name="username" 
                type="text" 
                className="h-[42px] text-sm border border-[#ced4da] border-r-0 rounded-l px-3 w-full outline-none text-[#212529] placeholder:text-[#888888]" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <span className="bg-[#e9ecef] border border-[#ced4da] border-l-0 rounded-r px-3.5 flex items-center justify-center text-[#333333] text-sm">
                <FontAwesomeIcon icon={faUser} />
              </span>
            </div>

            <div className="mb-4 flex relative">
              <input 
                name="password" 
                type="password" 
                className="h-[42px] text-sm border border-[#ced4da] border-r-0 rounded-l px-3 w-full outline-none text-[#212529] placeholder:text-[#888888]" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="bg-[#e9ecef] border border-[#ced4da] border-l-0 rounded-r px-3.5 flex items-center justify-center text-[#333333] text-sm">
                <FontAwesomeIcon icon={faKey} />
              </span>
            </div>

            <div className="grid gap-2">
              <button 
                type="submit" 
                className="bg-black border border-black text-white font-bold text-[14.5px] py-2 px-4 rounded w-full text-center relative hover:bg-[#1a1a1a] transition-colors cursor-pointer disabled:opacity-50" 
                disabled={isLoading}
              >
                <span>{isLoading ? 'Logging in...' : 'Login'}</span>
                <FontAwesomeIcon icon={faSignInAlt} className="float-right mt-1" />
              </button>
            </div>

            <small className="block text-[11px] text-[#6c757d] mt-3 leading-relaxed text-left">
              This site is protected by reCAPTCHA and the Google
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-[#007bff] mx-1 hover:underline">Privacy Policy</a> and
              <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="text-[#007bff] mx-1 hover:underline">Terms of Service</a> apply.
            </small>
          </form>
        </div>
      </div>

      <section className="fixed bottom-0 left-0 right-0 w-full bg-black px-[30px] py-2.5 z-[1000]">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-6">
            <Link className="text-white font-bold text-[13.5px] no-underline hover:underline" to="/terms-and-conditions"> Terms and Conditions </Link>
            <Link className="text-white font-bold text-[13.5px] no-underline hover:underline" to="/responsible-gaming"> Responsible Gaming </Link>
          </div>
          <div className="text-white font-bold text-sm">
            <h2>24X7 Support</h2>
          </div>
        </div>
      </section>
    </div>
  )
}
