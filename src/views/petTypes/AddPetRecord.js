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

import { PUBLIC_API } from '../../config/index'

const AddPetRecord = ({ show, setShow, refetch, petTypeId, setEditId }) => {
  const [petRecord, setPetRecord] = React.useState({
    name: '',
    description: '',
    active: true
  })

  const [
    { loading },
    fetch
  ] = useAxios(
    {
      url: PUBLIC_API + '/pet-types',
      method: 'POST'
    },
    { manual: true }
  )

  const resetAndCancel = () => {
    setShow(false)
    setPetRecord({
      name: '',
      description: '',
      active: true
    })

    setEditId(null)
  }

  const confirmClose = () => {
    setShow(false)
    setPetRecord({
      name: '',
      description: '',
      active: true
    })
    setEditId(null)
    refetch()
  }

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
      const config = {
        data: {
          ...petRecord
        }
      }

      if (petTypeId) {
        config.url = `PUBLIC_API + '/pet-types/${petTypeId}`
        config.method = 'PUT'
      }

      fetch(config).then(resp => {
        confirmClose()
      })
    }
  }

  React.useEffect(() => {
    if (petTypeId && show) {
      fetch({
        url: PUBLIC_API + `/pet-types/${petTypeId}`,
        method: 'GET'
      })
        .then(resp => {
          setPetRecord({
            name: resp.data.name,
            description: resp.data.description,
            active: resp.data.active
          })
        })
    }
  }, [petTypeId, fetch, show])

  return (
    <>
      <CModal
        show={show}
        onClose={() => setShow(false)}
      >
        <CModalHeader closeButton>Add Pet Type</CModalHeader>
        <CModalBody>
          {
            loading?
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
