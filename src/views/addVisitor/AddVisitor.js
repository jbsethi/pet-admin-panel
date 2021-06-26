import React, { useContext } from 'react'
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

import { AppContext } from '../../App.js'
import { PUBLIC_API } from '../../config/index'

const AddVisitor = () => {
  const history = useHistory()
  const { addToast } = useContext(AppContext)

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
      url: PUBLIC_API + '/patients',
      method: 'POST',
      data: {
        ...state.visitorRecord
      }
    }).then(resp => {
      dispatch({ type: 'setVisitorsId', payload: resp.data.id })
      dispatch({ type: 'setIsVisitorRecordAdded', payload: true })
    }).catch(err => {
      addToast({
        message: err.response.data.message
      })
    })
  }

  const storeNewOrder = () => {
    const data = {
      patientId: state.visitorsId,
      appointment: state.isDoctorVisitAdded,
      checkUpPrice: +state.doctorsReceipt.fee,
      description: 'Order Receipt For Shopping.',
      followUp: state.doctorsReceipt.isFollowUp,
      assignTo: state.doctorsReceipt.assignTo || null,
      items: state.receiptItems.filter(item => item.id !== null).map(item => {
        return {
          itemId: item.id,
          quantity: item.qty,
          discount: item.discount || 0
        }
      }),
      packages: state.receiptItems.filter(item => item.packageId !== null).map(item => {
        return {
          packageId: item.packageId,
          quantity: item.qty,
          discount: item.discount || 0
        }
      })
    }

    fetchRecord({
      url: PUBLIC_API + '/orders',
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

  const resetForm = () => {
    dispatch({ type: 'setVisitorsRecord', payload: {
      emiratesId: '',
      name: '',
      email: '',
      contact: ''
    }})
    dispatch({ type: 'setVisitorsId', payload: null })
    dispatch({ type: 'setIsVisitorRecordAdded', payload: false })
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
    dispatch({ type: 'setKeyword', payload: {} })
  }

  React.useEffect(() => {
    if (state.keyword.length > 0) {
      fetchRecord({
        url: PUBLIC_API + '/patients',
        params: {
          search: state.keyword
        }
      }).then(resp => {
        dispatch({ type: 'setItems', payload: (resp?.data?.rows || []).map((item, idx) => {
          return {
            label: (idx + 1) + ': ' + item.name + ' - ' + item.contact,
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
                  <CButton onClick={resetForm} className="w-25 mr-1" color="danger">Clear</CButton>
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
