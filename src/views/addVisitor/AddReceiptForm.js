import React from 'react'

import RSelect from 'react-select';

import {
  CModal,
  CModalHeader,
  CModalFooter,
  CModalBody,
  CButton,
  CFormGroup,
  CCol,
  CLabel,
  CInput
} from '@coreui/react'

import useAxios from 'axios-hooks'

const AddReceiptForm = ({ show, setShow }) => {
  const [addReceiptRecord, setAddReceiptRecord] = React.useState({
    categoryId: null,
    itemId: null,
    quantity: 1
  })

  const [categories, setCategories] = React.useState([])
  const [items, setItems] = React.useState([])

  const [
    ,
    fetchRecord
  ] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/services',
      method: 'POST'
    },
    { manual: true }
  )

  const handleChange = (e) => {
    if (e.isSelect) {
      setAddReceiptRecord(oldState => {
        return {
          ...oldState,
          [e.valueFor]: e.option
        }
      })
    } else {
      setAddReceiptRecord(oldState => {
        return {
          ...oldState,
          [e.target.name]: e.target.value
        }
      })
    }
  }

  const getCategories = React.useCallback(async () => {
    try {
      const record = await fetchRecord({
        url: 'https://app.aloropivetcenter.com/api/services',
        method: 'GET'
      })

      const options = (record?.data?.rows || []).map(category => {
        return {
          label: category.displayName,
          value: category.id
        }
      })

      setCategories(options)
    } catch (err) {
      console.log(err)
    }
  }, [fetchRecord])

  const getItems = React.useCallback(async () => {
    try {
      const record = await fetchRecord({
        url: 'https://app.aloropivetcenter.com/api/items',
        method: 'GET'
      })

      const options = (record?.data?.rows || []).map(item => {
        return {
          label: item.name,
          value: item.id,
          price: item.price
        }
      })

      setItems(options)
    } catch (err) {
      console.log(err)
    }
  }, [fetchRecord])

  const submitRecord = () => {
    console.log(addReceiptRecord)
  }

  React.useEffect(() => {
    if (show) {
      getCategories()
    }
  }, [show, getCategories])

  React.useEffect(() => {
    if (show && addReceiptRecord.categoryId) {
      setItems([])
      getItems()
    }
  }, [show, getItems, addReceiptRecord.categoryId])

  return (
    <CModal
      show={show}
      onClose={() => setShow(false)}
    >
      <CModalHeader>
        Add Item
      </CModalHeader>
      <CModalBody>
        <CFormGroup row>
          <CCol>
            <CLabel className="pt-2" htmlFor="text-category">Category</CLabel>
          </CCol>
          <CCol xs="12">
            <RSelect value={addReceiptRecord.categoryId} name="categoryId" options={categories} onChange={(e) => handleChange({isSelect: true, valueFor: 'categoryId', option: e})}/>
          </CCol>
        </CFormGroup>
        <CFormGroup row>
          <CCol>
            <CLabel className="pt-2" htmlFor="text-package-item">Package or Item</CLabel>
          </CCol>
          <CCol xs="12">
            <RSelect value={addReceiptRecord.itemId} name="packageItem" options={items} onChange={(e) => handleChange({isSelect: true, valueFor: 'itemId', option: e})}/>
          </CCol>
        </CFormGroup>
        <CFormGroup row>
          <CCol>
            <CLabel className="pt-2" htmlFor="text-qty">Quantity</CLabel>
          </CCol>
          <CCol xs="12">
            <CInput value={addReceiptRecord.quantity} id="text-qty" name="quantity" placeholder="Enter Quantity" type="number" onChange={handleChange} />
          </CCol>
        </CFormGroup>
      </CModalBody>
      <CModalFooter>
        <CButton color="danger" onClick={() => setShow(false)}>Cancel</CButton>
        <CButton color="primary" onClick={submitRecord}>Submit</CButton>
      </CModalFooter>
    </CModal>
  )
}

export default AddReceiptForm
