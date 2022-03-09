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

import { AppContext } from '../../../App.js'
import { PUBLIC_API } from '../../../config/index'


const AddReceiptForm = ({ show, setShow, dispatch,calculateTotalPrice }) => {
  const { addToast } = React.useContext(AppContext)
  const [addReceiptRecord, setAddReceiptRecord] = React.useState({
    categoryId: null,
    itemId: null,
    packageId: null,
    quantity: 1,
    discount: 0
  })

  const [petType, setPetType] = React.useState(undefined)
  const [categories, setCategories] = React.useState([])
  const [petTypes, setPetTypes] = React.useState([])
  const [items, setItems] = React.useState([])
  const [packages, setPackages] = React.useState([])

  const [
    ,
    fetchRecord
  ] = useAxios(
    {
      url: PUBLIC_API + '/services',
      method: 'POST'
    },
    { manual: true }
  )

  const petTypeSet = async (e) => {
    setPetType(e.option)

    const record2 = await fetchRecord({
      url: PUBLIC_API + '/items/records/active',
      method: 'GET',
      params: {
        serviceId: addReceiptRecord.categoryId?.value || null,
        petTypeId: e.option.value
      }
    })

    const options2 = (record2?.data || []).map(item => {
      return {
        label: item.name,
        value: item.id,
        price: item.price
      }
    })

    setItems(options2)
  }

  const handleChange = (e) => {
    if (e.isSelect) {
      let resetOther
      if (['packageId', 'itemId'].includes(e.valueFor)) {
        resetOther = e.valueFor === 'itemId' ? 'packageId' : 'itemId'
      }
      setAddReceiptRecord(oldState => {
        return {
          ...oldState,
          [resetOther]: null,
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
        url: PUBLIC_API + '/services',
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
      if (err.response)
      addToast({
        message: err?.response?.data?.message || 'Error Try again later !'
      })
    }
  }, [fetchRecord])

  const getPackageItems = React.useCallback(async () => {
    try {
      setAddReceiptRecord(oldState => {
        return {
          ...oldState,
          itemId: null,
          packageId: null,
        }
      })

      const record = await fetchRecord({
        url: PUBLIC_API + '/packages/records/active',
        method: 'GET',
        params: {
          serviceId: addReceiptRecord.categoryId?.value || null
        }
      })

      const options = (record?.data || []).map(item => {
        return {
          label: item.name,
          value: item.id,
          price: item.price
        }
      })

      setPackages(options)

      const record3 = await fetchRecord({
        url: PUBLIC_API + '/pet-types/records/active',
        method: 'GET'
      })

      const options3 = (record3?.data || []).map(item => {
        return {
          label: item.name,
          value: item.id,
        }
      })

      setPetTypes(options3)

      const record2 = await fetchRecord({
        url: PUBLIC_API + '/items/records/active',
        method: 'GET',
        params: {
          serviceId: addReceiptRecord.categoryId?.value || null
        }
      })

      const options2 = (record2?.data || []).map(item => {
        return {
          label: item.name,
          value: item.id,
          price: item.price
        }
      })

      setItems(options2)
    } catch (err) {
      addToast({
        message: err?.response?.data?.message || 'Error occured. Please try again .'
      })
    }
  }, [fetchRecord, addReceiptRecord?.categoryId?.value])

  const submitRecord = () => {
    if (!(addReceiptRecord.categoryId && (addReceiptRecord.itemId || addReceiptRecord.packageId))) {
      addToast({
        message: 'Please select item first !'
      })
    } else if (addReceiptRecord.quantity <= 0) {
      addToast({
        message: 'Quantity must not be 0 !'
      })
    } else {
      dispatch({ type: 'addItemInReceipt', payload: addReceiptRecord })
      setAddReceiptRecord({
        categoryId: null,
        itemId: null,
        packageId: null,
        quantity: 1,
        discount: 0
      })
      setShow(false)
      calculateTotalPrice(addReceiptRecord)
    }
  }

  React.useEffect(() => {
    if (show) {
      getCategories()
    }
  }, [show, getCategories])

  React.useEffect(() => {
    if (show && addReceiptRecord.categoryId) {
      setItems([])
      setPackages([])
      getPackageItems()
    }
  }, [show, getPackageItems, addReceiptRecord.categoryId])

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
            <CLabel className="pt-2" htmlFor="text-package">Package</CLabel>
          </CCol>
          <CCol xs="12">
            <RSelect value={addReceiptRecord.packageId} name="packageItem" options={packages} onChange={(e) => handleChange({isSelect: true, valueFor: 'packageId', option: e})}/>
          </CCol>
        </CFormGroup>
        <CFormGroup row>
          <CCol>
            <CLabel className="pt-2" htmlFor="text-package-item">Pet Type</CLabel>
          </CCol>
          <CCol xs="12">
            <RSelect value={petType} name="packageItem" options={petTypes} onChange={(e) => petTypeSet({isSelect: true, valueFor: 'petTypeId', option: e})}/>
          </CCol>
        </CFormGroup>
        <CFormGroup row>
          <CCol>
            <CLabel className="pt-2" htmlFor="text-package-item">Item</CLabel>
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
        <CFormGroup row>
          <CCol>
            <CLabel className="pt-2" htmlFor="text-qty">Discount ( % )</CLabel>
          </CCol>
          <CCol xs="12">
            <CInput value={addReceiptRecord.discount} id="text-qty" name="discount" placeholder="Enter discount" type="number" onChange={handleChange} />
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
