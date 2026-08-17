import React, { useEffect } from 'react'
import './style.css'

/**
 * Common Modal Component
 * 
 * Clean component using standard HTML classes powered by external Tailwind CSS (@apply) file
 */
export default function CommonModal({
  show,
  onClose,
  title = 'Set Button Value',
  children,
  showHeader = true,
  showFooter = false,
  footer,
  dialogClassName = '',
  bodyClassName = 'p-2',
  position = 'top'
}) {

  // ESC key listener & body scroll lock
  useEffect(() => {
    if (!show) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div
      className={`modal-overlay modal-pos-${position}`}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose()
        }
      }}
    >
      <div className={`modal-dialog ${dialogClassName}`}>
        <div className="modal-content">
          {showHeader && (
            <div className="modal-header">
              <div className="modal-title h4">{title}</div>
              <button
                type="button"
                className="btn-close-custom"
                aria-label="Close"
                onClick={onClose}
              >
                ✕
              </button>
            </div>
          )}
          <div className={`modal-body ${bodyClassName}`}>
            {children}
          </div>

          {(showFooter || footer) && (
            <div className="modal-footer">
              {footer ? (
                footer
              ) : (
                <button
                  type="button"
                  className="btn btn-close-footer"
                  onClick={onClose}
                >
                  Close
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

