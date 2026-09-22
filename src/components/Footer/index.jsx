import { Link } from 'react-router-dom'
import './style.css'

export default function Footer() {
  return (
    <div className="footer-wrapper-container">
      <section className="footer">
        <div className="footer-top">
          <div className="footer-links">
            <nav className="navbar navbar-expand-sm">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/terms-and-conditions" target="_blank">
                    Terms and Conditions
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/responsible-gaming" target="_blank">
                    Responsible Gaming
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="support-detail">
            <h2>24X7 Support</h2>
            <p></p>
          </div>
          <div className="social-icons-box"></div>
        </div>
      </section>

      <div className="footer-bottom">
        <div className="secure-logo">
          <div>
            <img src="https://wver.sprintstaticdata.com/v3/static/front/img/ssl.png" alt="100% Safe SSL" />
          </div>
          <div className="ml-2">
            <b>100% SAFE</b>
            <div>Protected connection and encrypted data.</div>
          </div>
        </div>
        <div className="d-inline-block">
          <button type="button" className="btn p-0">
            <img src="https://versionobj.ecoassetsservice.com/v106/static/front/img/18plus.png" alt="18 Plus" />
          </button>
          <a href="https://www.gamcare.org.uk/" target="_blank" rel="noreferrer">
            <img src="https://versionobj.ecoassetsservice.com/v106/static/front/img/gamecare.png" alt="GamCare" />
          </a>
          <a href="https://www.gamblingtherapy.org/" target="_blank" rel="noreferrer">
            <img src="https://versionobj.ecoassetsservice.com/v106/static/front/img/gt.png" alt="Gambling Therapy" />
          </a>
        </div>
      </div>

      <div className="footer-text">
        <p></p>
        <p className="text-center">© Copyright 2026. All Rights Reserved. Powered by DIAMONDEXCH99.</p>
      </div>
    </div>
  )
}
