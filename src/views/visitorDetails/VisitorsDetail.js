import { CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react'

import React from 'react'
import useAxios from 'axios-hooks'

const VisitorsDetail = ({ id }) => {
  const [{ data, loading }, fetch] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/patients',
      method: 'GET',
    },
    {
      manual: true
    }
  )

  React.useEffect(() => {
    if (id) {
      fetch({
        url: `https://app.aloropivetcenter.com/api/patients/${id}`
      })
    }
  }, [id, fetch])

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
