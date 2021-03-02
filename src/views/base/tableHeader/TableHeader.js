import React from 'react'

import {
  CRow,
  CCol,
  CForm,
  CFormGroup,
  CInput,
} from '@coreui/react'


const TableHeader = ({ children }) => {
  return (
    <CRow className="align-items-center justify-content-between">
      <CCol sm="4">
        <CForm action="" method="post">
          <CFormGroup className="mb-0">
            <CInput
              type="email"
              name="nf-email"
              placeholder="Search Here.."
              autoComplete="off"
            />
          </CFormGroup>
        </CForm>
      </CCol>
      <CCol sm="4" className="d-flex justify-content-end">
        { children }
      </CCol>
    </CRow>
  )
}

export default TableHeader
