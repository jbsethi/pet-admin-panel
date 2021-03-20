import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormGroup,
  CLabel,
  CRow,
} from '@coreui/react'

import { useHistory } from 'react-router-dom'

import RSelect from 'react-select';

import useAxios from 'axios-hooks'

import NewVisitorsForm from './NewVisitorsForm.js'
import ReceiptForm from './ReceiptForm/ReceiptForm.js'
import DoctorsForm from './DoctorsForm/DoctorsForm.js'

import reducer from './addVisitorReducer'
import initialState from './addVisitorState'

const AddVisitor = () => {
  const history = useHistory()

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const [,
    fetchRecord
  ] = useAxios(
    {
      method: 'GET'
    },
    { manual: true }
  )

  const createNewVisitor = () => {
    fetchRecord({
      url: 'https://app.aloropivetcenter.com/api/patients',
      method: 'POST',
      data: {
        ...state.visitorRecord
      }
    }).then(resp => {
      dispatch({ type: 'setVisitorsId', payload: resp.data.id })
      dispatch({ type: 'setIsVisitorRecordAdded', payload: true })
    })
  }

  const storeNewOrder = () => {
    const data = {
      patientId: state.visitorsId,
      appointment: state.isDoctorVisitAdded,
      checkUpPrice: state.doctorsReceipt.fee,
      description: 'Order Receipt',
      itemIds: state.receiptItems.filter(item => item.id !== null).map(item => item.id),
      packageIds: state.receiptItems.filter(item => item.packageId !== null).map(item => item.packageId)
    }

    fetchRecord({
      url: 'https://app.aloropivetcenter.com/api/orders',
      method: 'POST',
      data
    }).then(resp => {
      dispatch({ type: 'resetForm', payload: null })
      history.push('/visitors')
    })
  }

  const handleSubmit = () => {
    if (!state.isVisitorRecordAdded) {
      createNewVisitor()
    } else {
      storeNewOrder()
    }
  }

  const handleUserChange = ({ value }) => {
    dispatch({ type: 'setVisitorsRecord', payload: {
      emiratesId: value.emiratesId,
      name: value.name,
      email: value.email,
      contact: value.contact
    }})
    dispatch({ type: 'setVisitorsId', payload: value.id })
    dispatch({ type: 'setIsVisitorRecordAdded', payload: true })
  }

  React.useEffect(() => {
    if (state.keyword.length > 0) {
      fetchRecord({
        url: 'https://app.aloropivetcenter.com/api/patients',
        params: {
          search: state.keyword
        }
      }).then(resp => {
        dispatch({ type: 'setItems', payload: (resp?.data?.rows || []).map(item => {
          return {
            label: item.name,
            value: item,
          }
        })})
      })
    }
  }, [state.keyword, fetchRecord])

  return (
    <>
      <CRow>
        <CCol xs="12" sm="12">
          <CCard>
            <CCardHeader>
              Visitor
              <small> Form</small>
            </CCardHeader>
            <CCardBody>
              <CFormGroup row>
                <CCol xs="12">
                  <CLabel className="pt-1" htmlFor="search">Search</CLabel>
                </CCol>
                <CCol xs="12">
                  <RSelect name="search" options={state.items} onInputChange={(input) => dispatch({ type: 'setKeyword', payload: input })} onChange={handleUserChange}></RSelect>
                </CCol>
              </CFormGroup>
              <CCard>
                <CCardBody>
                  <NewVisitorsForm 
                    isVisitorRecordAdded={state.isVisitorRecordAdded}
                    visitorRecord={state.visitorRecord}
                    dispatch={dispatch}
                  />
                </CCardBody>
              </CCard>

              {
                state.isVisitorRecordAdded &&
                <CRow>
                  <CCol sm="6">
                    <ReceiptForm
                      receiptFormVisibility={state.receiptFormVisibility}
                      showAddReceiptFormModal={state.showAddReceiptForm}
                      receiptItems={state.receiptItems}
                      dispatch={dispatch}
                    />
                  </CCol>
                  <CCol sm="6">
                    <DoctorsForm
                      visitorId={state.visitorsId}
                      doctorFormVisibility={state.doctorFormVisibility}
                      isDoctorVisitAdded={state.isDoctorVisitAdded}
                      doctorsReceipt={state.doctorsReceipt}
                      dispatch={dispatch}
                    />
                  </CCol>
                </CRow>
              }
            </CCardBody>
            <CCardFooter>
              <div className="d-flex">
                <div className="w-50 ml-auto text-right">
                  <CButton className="w-25 mr-1" color="danger">Clear</CButton>
                  <CButton onClick={handleSubmit} className="w-25" color="primary">Submit</CButton>
                </div>
              </div>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default AddVisitor
