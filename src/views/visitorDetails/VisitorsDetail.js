import { CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react'

import React from 'react'
import useAxios from 'axios-hooks'

import { AppContext } from '../../App.js'
import { PUBLIC_API } from '../../config/index'

const VisitorsDetail = ({ id }) => {
  const { addToast } = React.useContext(AppContext)
  const [{ data, loading }, fetch] = useAxios(
    {
      url: PUBLIC_API + '/patients',
      method: 'GET',
    },
    {
      manual: true
    }
  )

  React.useEffect(() => {
    if (id) {
      fetch({
        url: PUBLIC_API + `/patients/${id}`
      }).catch(err => {
        addToast({
          message: err.response?.data?.message || 'Error occured! Try again later.'
        })
      })
    }
  }, [id, fetch, addToast])

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>Visitor Details</CCardHeader>
          <CCardBody>
          {
            loading ?
            <>
              <p>Loading please wait ...</p>
            </> :
            <>
              <CRow className="py-2">
                <CCol md="2" className="text-right">Emirates ID</CCol>
                <CCol >{ data?.emiratesId || '-----' }</CCol>
              </CRow>
              <CRow className="py-2">
                <CCol md="2" className="text-right">Name</CCol>
                <CCol >{ data?.name || '-----' }</CCol>
              </CRow>
              <CRow className="py-2">
                <CCol md="2" className="text-right">Email</CCol>
                <CCol >{ data?.email || '-----' }</CCol>
              </CRow>
              <CRow className="py-2">
                <CCol md="2" className="text-right">Contact</CCol>
                <CCol >{ data?.contact || '-----' }</CCol>
              </CRow>
            </>
          }
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default VisitorsDetail
