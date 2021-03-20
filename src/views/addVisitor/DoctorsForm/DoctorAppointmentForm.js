import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalFooter,
  CModalBody,
  CFormGroup,
  CInput,
  CLabel,
  CCol,
  CSwitch,
  CButton,
} from '@coreui/react'

import useAxios from 'axios-hooks'

import RSelect from 'react-select';

import AddNewPetForm from './AddNewPetForm.js'

const DoctorAppointmentForm = ({ visitorId, dispatch }) => {
  const [,
    fetchRecord
  ] = useAxios(
    {
      method: 'GET'
    },
    { manual: true }
  )

  const [showAddAppointmentModal, setShowAddAppointmentModal] = React.useState(false)
  const [showNewPetModal, setShowNewPetModal] = React.useState(false)

  

  const [keyword, setKeyword] = React.useState('')
  const [items, setItems] = React.useState([])

  const [selectedPet, setSelectedPet] = React.useState(null)
  const [fee, setFee] = React.useState('')
  const [isFollowUp, setIsFollowUp] = React.useState(false)

  const handleChange = (option) => {
    setSelectedPet(option)
  }

  const addDoctorReceipt = () => {
    dispatch({ type: 'addDoctorReceipt', payload: {
      pet: selectedPet,
      fee,
      appointmentDate: new Date(),
      isFollowUp
    } })
  }

  React.useEffect(() => {
    if (keyword.length > 0) {
      fetchRecord({
        url: 'https://app.aloropivetcenter.com/api/pets',
        method: 'GET',
        params: {
          search: keyword
        }
      }).then(resp => {
        console.log(resp)
      })
    }
  }, [keyword, fetchRecord])

  React.useEffect(() => {
    fetchRecord({
      url: 'https://app.aloropivetcenter.com/api/pets',
      method: 'GET'
    }).then(resp => {
      
      setItems(resp?.data?.rows.map(o => {
        return {
          label: o.name,
          value: o
        }
      }) || [])
    })
  }, [fetchRecord])


  return (
    <div>
      <p onClick={() => setShowAddAppointmentModal(true)} className="my-5 text-center">Add Doctors appointment</p>

      <CModal
        show={showAddAppointmentModal}
        onClose={() => setShowAddAppointmentModal(false)}
      >
        <CModalHeader>
          Create Appointment
        </CModalHeader>
        <CModalBody>
          <CFormGroup row>
            <CCol xs="12">
              <CLabel className="pt-1" htmlFor="search">Select Pet</CLabel>
            </CCol>
            <CCol xs="12">
              <RSelect name="search" value={selectedPet} options={items} onInputChange={(input) => setKeyword(input)} onChange={handleChange}></RSelect>
            </CCol>
          </CFormGroup>
          <div className="text-right">
            <CButton onClick={() => setShowNewPetModal(true)} size="sm">Add New Pet</CButton>
          </div>
          <CFormGroup>
            <CLabel htmlFor="fee">Fee</CLabel>
            <CInput value={fee} onChange={(e) => setFee(e.target.value)} name="fee" id="fee" placeholder="Enter fees" />
          </CFormGroup>
          <CFormGroup row className="align-items-center pt-3">
            <CCol xs="3" md="3">
              <CLabel htmlFor="text-description" className="pl-1">Follow Up ?</CLabel>
            </CCol>
            <CCol xs="9" md="9">
              <CSwitch
                color="primary"
                name="active"
                value={isFollowUp}
                onChange={(e) => setIsFollowUp(e.target.checked)}
                {
                  ...({
                    variant: 'opposite',
                    shape:'pill'
                  })
                }
              />
            </CCol>
          </CFormGroup>

          <AddNewPetForm
            show={showNewPetModal}
            visitorId={visitorId}
            setShow={setShowNewPetModal}
            setItems={setItems}
            setSelectedPet={setSelectedPet}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => setShowAddAppointmentModal(false)}>Cancel</CButton>
          <CButton color="primary" onClick={addDoctorReceipt}>Submit</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default DoctorAppointmentForm
