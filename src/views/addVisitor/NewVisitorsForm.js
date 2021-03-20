import React from 'react'

import {
  CFormGroup,
  CInput,
  CLabel,
} from '@coreui/react'

const NewVisitorsForm = ({ isVisitorRecordAdded, visitorRecord, dispatch }) => {
  return (
    <>
      <CFormGroup>
        <CLabel htmlFor="emiratesId">Visitors Emirates ID</CLabel>
        <CInput disabled={isVisitorRecordAdded} value={visitorRecord.emiratesId} name="emiratesId" onChange={(e) => dispatch({ type: 'handleChangeVisitorRecord', payload: e })} id="emiratesId" placeholder="Enter Visitor's emirates id" />
      </CFormGroup>
      <CFormGroup>
        <CLabel htmlFor="name">Visitors Name</CLabel>
        <CInput disabled={isVisitorRecordAdded} value={visitorRecord.name} name="name" onChange={(e) => dispatch({ type: 'handleChangeVisitorRecord', payload: e })} id="name" placeholder="Enter Visitor's name" />
      </CFormGroup>
      <CFormGroup>
        <CLabel htmlFor="email">Email</CLabel>
        <CInput disabled={isVisitorRecordAdded} value={visitorRecord.email} name="email" onChange={(e) => dispatch({ type: 'handleChangeVisitorRecord', payload: e })} id="email" placeholder="Enter Visitor's email" />
      </CFormGroup>
      <CFormGroup>
        <CLabel htmlFor="contact">Phone No</CLabel>
        <CInput disabled={isVisitorRecordAdded} value={visitorRecord.contact} name="contact" onChange={(e) => dispatch({ type: 'handleChangeVisitorRecord', payload: e })} id="contact" placeholder="Enter Phone number" />
      </CFormGroup>
    </>
  )
}

export default NewVisitorsForm
