import React from 'react'
import CommonModal from '../Modal'
import RulesContent from './RulesContent'
import './style.css'

/**
 * RulesModal Component
 * 
 * Renders the Rules modal containing sport-by-sport exchange & betting rules
 */
export default function RulesModal({ show, onHide }) {
  return (
    <CommonModal
      show={show}
      onClose={onHide}
      title="Rules"
      dialogClassName="rules-modal-dialog"
      bodyClassName="rules-modal-body"
      position="center"
      showFooter={true}
    >
      <RulesContent />
    </CommonModal>
  )
}


