import React from 'react'
import useAxios from 'axios-hooks'

import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CFormGroup,
  CCol,
  CLabel,
  CInput,
  CTextarea,
  CSwitch,
  CRow,
} from '@coreui/react'

const AddPetRecord = ({ show, setShow, refetch, petTypeId, setEditId }) => {
  const [petRecord, setPetRecord] = React.useState({
    name: '',
    description: '',
    active: true
  })

  const [
    { data, loading, error },
    executePost
  ] = useAxios(
    {
      url: `https://app.aloropivetcenter.com/api/pet-types${petTypeId ? '/' + petTypeId : ''}`,
      method: petTypeId ? 'PUT' : 'POST'
    },
    { manual: true }
  )

  const [{ data: singleData, loading: singleLoading, error: singleError }, getSingleData] = useAxios(
    {
      url: `https://app.aloropivetcenter.com/api/pet-types/${petTypeId}`,
      method: 'GET'
    },
    {
      manual: true
    }
  )

  const toggle = () => {
    setShow(!show)
  }

  const resetAndCancel = () => {
    setPetRecord({
      name: '',
      description: '',
      active: true
    })

    setEditId(null)

    toggle()
  }

  const confirmClose = React.useCallback(() => {
    setShow(false)
    setPetRecord({
      name: '',
      description: '',
      active: true
    })
    setEditId(null)
    refetch()
  }, [])

  const handleChange = (e) => {
    setPetRecord((oldState) => {
      if (e.target.name === 'active') {
        return {
          ...oldState,
          [e.target.name]: e.target.checked
        }
      } else {
        return {
          ...oldState,
          [e.target.name]: e.target.value
        }
      }
    })
  }

  const storePetType = () => {
    if (!loading) {
      executePost({
        data: {
          ...petRecord
        }
      })
    }
  }

  React.useEffect(() => {
    if (data) {
      confirmClose()
    }
  }, [data, confirmClose])

  React.useEffect(() => {
    if (petTypeId && show) {
      getSingleData()
    }
  }, [petTypeId])

  React.useEffect(() => {
    if (singleData) {
      setPetRecord({
        name: singleData.name,
        description: singleData.description,
        active: singleData.active
      })
    }
  }, [singleData])

  return (
    <>
      <CModal
        show={show}
        onClose={toggle}
      >
        <CModalHeader closeButton>Add Pet Type</CModalHeader>
        <CModalBody>
          {
            singleLoading?
            <div className="py-5 text-center">Loading Details ...</div> :
            <CRow>
              <CCol className="px-5 pt-4">
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel className="pt-1" htmlFor="text-name">Name</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="text-name" name="name" value={petRecord.name} onChange={handleChange} placeholder="Enter Name for Pet type" />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel className="pt-1" htmlFor="text-description">Description</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CTextarea id="text-description" name="description" value={petRecord.description} onChange={handleChange} placeholder="Enter Description ..." ></CTextarea>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol xs="3" md="3">
                    <CLabel htmlFor="text-description">Active</CLabel>
                  </CCol>
                  <CCol xs="9" md="9">
                    <CSwitch
                      color="primary"
                      name="active"
                      checked={petRecord.active}
                      onChange={handleChange}
                      {
                        ...({
                          variant: 'opposite',
                          shape:'pill'
                        })
                      }
                    />
                  </CCol>
                </CFormGroup>
              </CCol>
            </CRow>
          }
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => resetAndCancel()}
          >
            Cancel
          </CButton>
          <CButton onClick={storePetType} className="ml-1" color="primary">{ loading ? 'Loading' : 'Confirm' }</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AddPetRecord
