import React from 'react'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CSwitch,
} from '@coreui/react'

import DoctorReceipt from './DoctorReceipt.js'
import DoctorAppointmentForm from './DoctorAppointmentForm.js'

const DoctorsForm = ({ visitorId, doctorFormVisibility, isDoctorVisitAdded, doctorsReceipt, dispatch }) => {
  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>Doctor's Visit</div>
          <CSwitch
            className="mr-1"
            color="dark"
            shape="pill"
            variant="opposite"
            value={doctorFormVisibility}
            onChange={(e) => dispatch({ type: 'setDoctorFormVisibility', payload: e.target.checked })}
          />
        </CCardHeader>
        {
          doctorFormVisibility &&
          <CCardBody>
            {
              isDoctorVisitAdded ?
              <DoctorReceipt doctorsReceipt={doctorsReceipt} /> :
              <DoctorAppointmentForm visitorId={visitorId} dispatch={dispatch} />
            }
          </CCardBody> 
        }
      </CCard>
    </>
  )
}

export default DoctorsForm
