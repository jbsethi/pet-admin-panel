import React from 'react'

import {
  CRow,
  CCol,
  CFormGroup,
  CInput,
} from '@coreui/react'


const TableHeader = ({ keyword = '', changeKeyword = null, children }) => {
  return (
    <CRow className="align-items-center justify-content-between pb-2">
      <CCol sm="4">
        <CFormGroup className="mb-0">
          <CInput
            type="text"
            name="nf-text"
            placeholder="Search Here.."
            autoComplete="off"
            value={keyword}
            onChange={changeKeyword}
            onKeyPress={changeKeyword}
          />
        </CFormGroup>
      </CCol>
      <CCol sm="4" className="d-flex justify-content-end">
        { children }
      </CCol>
    </CRow>
  )
}

export default TableHeader
