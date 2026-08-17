import React, { useState, useRef, useEffect } from 'react'
import CommonModal from '../Modal'
import RulesContent from './RulesContent'
import './style.css'

/**
 * RulesModal Component
 * 
 * Renders the Rules modal containing sport-by-sport exchange & betting rules
 */
export default function RulesModal({ show, onHide }) {
  const [langOpen, setLangOpen] = useState(false)
  const [selectedLang, setSelectedLang] = useState({
    code: 'en',
    name: 'English',
    flag: '/icons/flag_english.png'
  })
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const languageSelector = (
    <div className="rules-langualge" ref={dropdownRef}>
      <div className={`dropdown ${langOpen ? 'show' : ''}`}>
        <button
          type="button"
          id="lang-dropdown"
          aria-expanded={langOpen}
          className={`dropdown-toggle btn ${langOpen ? 'show' : ''}`}
          onClick={() => setLangOpen((prev) => !prev)}
        >
          <img src={selectedLang.flag} alt={selectedLang.name} />
          {selectedLang.name}
        </button>
        {langOpen && (
          <div
            aria-labelledby="lang-dropdown"
            className="dropdown-menu show"
          >
            <a
              data-rr-ui-dropdown-item=""
              className="dropdown-item"
              role="button"
              tabIndex="0"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setSelectedLang({
                  code: 'en',
                  name: 'English',
                  flag: '/icons/flag_english.png'
                })
                setLangOpen(false)
              }}
            >
              <img src="/icons/flag_english.png" alt="English" />
              English
            </a>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <CommonModal
      show={show}
      onClose={onHide}
      title="Rules"
      headerRight={languageSelector}
      dialogClassName="rules-modal-dialog"
      bodyClassName="rules-modal-body"
      position="center"
      showFooter={true}
    >
      <RulesContent />
    </CommonModal>
  )
}




