import React from 'react'
import {
  CCol,
  CRow,
} from '@coreui/react'

const DoctorReceipt = ({ doctorsReceipt }) => {
  return (
    <div>
      <p className="font-weight-bold font-lg">Doctor receipt form</p>
      <CRow className="my-2">
        <CCol md="4" className="font-weight-bold">Pet's Name</CCol>
        <CCol>
          {doctorsReceipt.pet.label}
        </CCol>
      </CRow>
      <CRow className="my-2">
        <CCol md="4" className="font-weight-bold">Check up Date</CCol>
        <CCol>
          {
            doctorsReceipt.appointmentDate.getDate() + '/' +
            (+doctorsReceipt.appointmentDate.getMonth() + 1) + '/' +
            doctorsReceipt.appointmentDate.getFullYear()
          }
        </CCol>
      </CRow>
      <CRow className="my-2">
        <CCol md="4" className="font-weight-bold">Doctor's Name</CCol>
        <CCol>--</CCol>
      </CRow>
      <CRow className="my-2">
        <CCol md="4" className="font-weight-bold">Is Follow Up ?</CCol>
        <CCol>{
          doctorsReceipt.isFollowUp ? 'Yes' : 'No'  
        }</CCol>
      </CRow>
      <CRow className="my-2">
        <CCol md="4" className="font-weight-bold">Doctor's Fee</CCol>
        <CCol>{ doctorsReceipt.fee } AED</CCol>
      </CRow>
    </div>
  )
}

export default DoctorReceipt
