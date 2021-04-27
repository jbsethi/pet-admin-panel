import React from 'react'
import useAxios from 'axios-hooks'

import AsyncSelect from 'react-select';

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

const AddPackage = ({ show, setShow, refetch, itemId, setEditId }) => {
  const [keyword, setKeyword] = React.useState('')
  const [services, setServices] = React.useState([])
  const [petTypes, setPetTypes] = React.useState([])
  const [items, setItems] = React.useState([])

  const [packageRecord, setPackageRecord] = React.useState({
    name: '',
    description: '',
    price: '',
    petTypeId: '',
    serviceId: '',
    items: [],
    active: true
  })

  const [
    { loading },
    fetchData
  ] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/packages',
      method: 'POST'
    },
    { manual: true }
  )

  const [
    ,
    fetchRecord
  ] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/items',
      method: 'GET'
    },
    { manual: true }
  )

  const resetAndCancel = () => {
    setShow(false)
    setPackageRecord({
      name: '',
      description: '',
      price: '',
      petTypeId: '',
      serviceId: '',
      items: [],
      active: true
    })

    setEditId(null)
  }

  const confirmClose = () => {
    setShow(false)
    setPackageRecord({
      name: '',
      description: '',
      price: '',
      petTypeId: '',
      serviceId: '',
      items: [],
      active: true
    })
    setEditId(null)
    refetch()
  }

  const handleChange = (e) => {
    setPackageRecord((oldState) => {
      return {
        ...oldState,
        [e.target.name]: e.target.name === 'active' ? e.target.checked : e.target.value
      }
    })
  }

  const handleItemChange = (context) => {
    setPackageRecord((oldState) => {
      return {
        ...oldState,
        items: context
      }
    })
  }

  const storePackage = () => {
    if (!loading) {
      const config = {
        data: {
          ...packageRecord,
          itemIds: packageRecord.items.map(item => item.value)
        }
      }

      delete config.data.items

      if (itemId) {
        config.url = `https://app.aloropivetcenter.com/api/packages/${itemId}`
        config.method = 'PUT'
      }

      fetchData(config).then(resp => {
        confirmClose()
      })
    }
  }

  const initializeRecord = React.useCallback(async () => {
    let result = await fetchData({
      url: `https://app.aloropivetcenter.com/api/services`,
      method: 'GET'
    })

    setServices(result?.data?.rows || [])

    result = await fetchData({
      url: `https://app.aloropivetcenter.com/api/pet-types`,
      method: 'GET'
    })

    setPetTypes(result?.data?.rows || [])

    if (itemId) {
      result = await fetchData({
        url: `https://app.aloropivetcenter.com/api/packages/${itemId}`,
        method: 'GET'
      })

      const defaultItems = result.data.PackageItems.map(item => {
        return {
          label: item.Item.name,
          value: item.Item.id
        }
      })

      setItems(defaultItems)

      setPackageRecord({
        name: result.data.name,
        description: result.data.description,
        price: result.data.price,
        petTypeId: result.data.petTypeId,
        serviceId: result.data.serviceId,
        items: defaultItems,
        active: result.data.active
      })
    }
  }, [fetchData, itemId])

  React.useEffect(() => {
    if (show) {
      initializeRecord()
    }
  }, [show, initializeRecord])

  React.useEffect(() => {
    console.log(keyword)
    if (show) {
      fetchRecord({
        params: {
          search: keyword
        }
      }).then(resp => {
        setItems((resp?.data?.rows || []).map(item => {
          return {
            label: item.name,
            value: item.id
          }
        }))
      })
    }
  }, [keyword, fetchRecord, show])

  return (
    <>
      <CModal
        show={show}
        onClose={() => setShow(false)}
      >
        <CModalHeader closeButton>Add Package</CModalHeader>
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
                    <CInput id="text-name" name="name" value={packageRecord.name} onChange={handleChange} placeholder="Enter Name for item" />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel className="pt-1" htmlFor="text-price">Price</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="text-price" name="price" value={packageRecord.price} onChange={handleChange} placeholder="Enter Price for item" />
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
                      value={packageRecord.petTypeId}
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
                      value={packageRecord.serviceId}
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
                    <CLabel className="pt-1" htmlFor="text-service">Items</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <AsyncSelect onChange={handleItemChange} name="itemIds" isMulti options={items} value={packageRecord.items} onInputChange={(input) => setKeyword(input)} ></AsyncSelect>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel className="pt-1" htmlFor="text-description">Description</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CTextarea id="text-description" name="description" value={packageRecord.description} onChange={handleChange} placeholder="Enter Description ..." ></CTextarea>
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
                      checked={packageRecord.active}
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
          <CButton onClick={storePackage} className="ml-1" color="primary">{ loading ? 'Loading' : 'Confirm' }</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AddPackage
