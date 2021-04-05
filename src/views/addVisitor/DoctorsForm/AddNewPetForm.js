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
    breed: '',
    age: '',
    color: '',
    specie: '',
    gender: '',
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
    }).catch(err => {
      console.log(err.response)
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
          <CInput value={petInfo.breed} name="breed" onChange={handleChangePetInfo} id="type" placeholder="Enter breed" />
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
          <CLabel htmlFor="specie">Specie</CLabel>
          <CInput value={petInfo.specie} name="specie" onChange={handleChangePetInfo} id="specie" placeholder="Enter specie" />
        </CFormGroup>
        <CFormGroup>
          <CLabel htmlFor="gender">Sex</CLabel>
          <CInput value={petInfo.gender} name="gender" onChange={handleChangePetInfo} id="gender" placeholder="Enter gender" />
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
