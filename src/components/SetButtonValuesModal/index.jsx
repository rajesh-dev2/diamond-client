import React from 'react'
import CommonModal from '../Modal'
import SetButtonValuesContent from './SetButtonValuesContent'

/**
 * SetButtonValuesModal Component
 * 
 * Renders CommonModal with SetButtonValuesContent passed as children
 */
export default function SetButtonValuesModal({ show, onHide }) {
  return (
    <CommonModal
      show={show}
      onClose={onHide}
      title="Set Button Value"
      dialogClassName="set-button-value-modal"
    >
      <SetButtonValuesContent onUpdate={onHide} />
    </CommonModal>
  )
}
