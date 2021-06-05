import React, { useContext } from 'react'
import useAxios from 'axios-hooks'

import { AppContext } from '../../App.js'
import { PUBLIC_API } from '../../config/index'


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
  CSelect,
} from '@coreui/react'

const AddItem = ({ show, setShow, refetch, itemId, setEditId }) => {
  const { addToast } = useContext(AppContext)
  const [services, setServices] = React.useState([])
  const [petTypes, setPetTypes] = React.useState([])

  const [itemRecord, setItemRecord] = React.useState({
    name: '',
    description: '',
    price: '',
    petTypeId: '',
    serviceId: '',
    active: true
  })

  const [
    { loading },
    fetch
  ] = useAxios(
    {
      url: PUBLIC_API + '/items',
      method: 'POST'
    },
    { manual: true }
  )

  const resetAndCancel = () => {
    setShow(false)
    setItemRecord({
      name: '',
      description: '',
      price: '',
      petTypeId: '',
      serviceId: '',
      active: true
    })

    setEditId(null)
  }

  const confirmClose = () => {
    setShow(false)
    setItemRecord({
      name: '',
      description: '',
      price: '',
      petTypeId: '',
      serviceId: '',
      active: true
    })
    setEditId(null)
    refetch()
  }

  const handleChange = (e) => {
    setItemRecord((oldState) => {
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

  const storeItem = () => {
    if (!loading) {
      const config = {
        data: {
          ...itemRecord
        }
      }

      if (itemId) {
        config.url = PUBLIC_API + `/items/${itemId}`
        config.method = 'PUT'
      }

      fetch(config).then(resp => {
        confirmClose()
      }).catch(err => {
        addToast({
          message: err.response.data.message
        })
      })
    }
  }

  const initializeRecord = React.useCallback(async () => {
    try {
      let result = await fetch({
        url: PUBLIC_API + '/services',
        method: 'GET'
      })
  
      setServices(result?.data?.rows || [])
  
      result = await fetch({
        url: PUBLIC_API + '/pet-types/records/active',
        method: 'GET'
      })

      console.log(result)
  
      setPetTypes(result?.data || [])
  
      if (itemId) {
        result = await fetch({
          url: PUBLIC_API + `/items/${itemId}`,
          method: 'GET'
        })
    
        setItemRecord({
          name: result.data.name,
          description: result.data.description,
          price: result.data.price,
          petTypeId: result.data.petTypeId,
          serviceId: result.data.serviceId,
          active: result.data.active
        })
      }
    } catch (err) {
      addToast({
        message: err?.response?.data?.message || 'Error occured !'
      })
    }
  }, [fetch, itemId])

  React.useEffect(() => {
    if (show) {
      initializeRecord()
    }
  }, [show, initializeRecord])

  return (
    <>
      <CModal
        show={show}
        onClose={() => setShow(false)}
      >
        <CModalHeader closeButton>Add Item</CModalHeader>
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
                    <CInput id="text-name" name="name" value={itemRecord.name} onChange={handleChange} placeholder="Enter Name for item" />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel className="pt-1" htmlFor="text-price">Price</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="text-price" name="price" value={itemRecord.price} onChange={handleChange} placeholder="Enter Price for item" />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel className="pt-1" htmlFor="text-pet-type">Pet Type</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CSelect 
                      custom 
                      name="petTypeId" 
                      id="text-pet-type"
                      onChange={handleChange}
                      value={itemRecord.petTypeId}
                    >
                      <option value="0">Select</option>
                      {
                        petTypes.map(petType => {
                          return (
                            <option key={petType.id} value={petType.id}>{petType.name}</option>
                          )
                        })
                      }
                    </CSelect>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel className="pt-1" htmlFor="text-service">Service</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CSelect 
                      custom 
                      name="serviceId" 
                      id="text-service"
                      onChange={handleChange}
                      value={itemRecord.serviceId}
                    >
                      <option value="0">Select</option>
                      {
                        services.map(service => {
                          return (
                            <option key={service.id} value={service.id}>{service.displayName}</option>
                          )
                        })
                      }
                    </CSelect>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel className="pt-1" htmlFor="text-description">Description</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CTextarea id="text-description" name="description" value={itemRecord.description} onChange={handleChange} placeholder="Enter Description ..." ></CTextarea>
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
                      checked={itemRecord.active}
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
          <CButton onClick={storeItem} className="ml-1" color="primary">{ loading ? 'Loading' : 'Confirm' }</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AddItem
