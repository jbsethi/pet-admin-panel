import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalFooter,
  CModalBody,
  CFormGroup,
  CInput,
  CLabel,
  CButton,
  CCol,
  CSwitch
} from '@coreui/react'

import useAxios from 'axios-hooks'

const AddNewPetForm = ({ show, setShow, visitorId, setItems, setSelectedPet }) => {
  const [,
    fetchRecord
  ] = useAxios(
    {
      method: 'GET'
    },
    { manual: true }
  )

  const [petInfo, setPetInfo] = React.useState({
    id: '',
    name: '',
    pet: '',
    age: '',
    color: '',
    microchip: false
  })

  const handleChangePetInfo = (e) => {
    setPetInfo(oldState => {
      return {
        ...oldState,
        [e.target.name]: e.target.value
      }
    })
  }

  const setIsMicroChip = (status) => {
    setPetInfo(oldState => {
      return {
        ...oldState,
        microchip: status
      }
    })
  }

  const storePetInfo = () => {
    const data = {...petInfo, patientId: visitorId}

    delete data.id;

    fetchRecord({
      url: 'https://app.aloropivetcenter.com/api/pets',
      method: 'POST',
      data
    }).then(resp => {
      setPetInfo(oldState => {
        return {
          ...oldState,
          id: resp.data.id
        }
      })

      setItems(oldState => {
        return [...oldState, resp.data]
      })

      setSelectedPet({
        label: resp.data.name,
        value: resp.data
      })

      setShow(false)
    })
  }

  return (
    <CModal
      show={show}
      onClose={() => setShow(false)}
    >
      <CModalHeader>
        Add New Pet
      </CModalHeader>
      <CModalBody>
        <CFormGroup>
          <CLabel htmlFor="name">Pet Name</CLabel>
          <CInput value={petInfo.name} name="name" onChange={handleChangePetInfo} id="name" placeholder="Enter name" />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="type">Breed</CLabel>
          <CInput value={petInfo.pet} name="pet" onChange={handleChangePetInfo} id="type" placeholder="Enter type" />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="age">Pet Age</CLabel>
          <CInput value={petInfo.age} name="age" onChange={handleChangePetInfo} id="age" placeholder="Enter age" />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="color">Pet Color</CLabel>
          <CInput value={petInfo.color} name="color" onChange={handleChangePetInfo} id="color" placeholder="Enter color" />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="species">Species</CLabel>
          <CInput value={petInfo.species} name="species" onChange={handleChangePetInfo} id="species" placeholder="Enter species" />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="sex">Sex</CLabel>
          <CInput value={petInfo.sex} name="sex" onChange={handleChangePetInfo} id="sex" placeholder="Enter sex" />
        </CFormGroup>
      </CModalBody>
      <CFormGroup row className="align-items-center px-3">
        <CCol xs="3" md="3">
          <CLabel htmlFor="text-microchip" className="pl-1">Microchip ?</CLabel>
        </CCol>
        <CCol xs="9" md="9">
          <CSwitch
            color="primary"
            name="microchip"
            value={petInfo.microchip}
            onChange={(e) => setIsMicroChip(e.target.checked)}
            {
              ...({
                variant: 'opposite',
                shape:'pill'
              })
            }
          />
        </CCol>
      </CFormGroup>
      <CModalFooter>
        <CButton onClick={() => setShow(false)} color="danger">Cancel</CButton>
        <CButton onClick={storePetInfo} color="primary">Submit</CButton>
      </CModalFooter>
    </CModal>
  )
}

export default AddNewPetForm
