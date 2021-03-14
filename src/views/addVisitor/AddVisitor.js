import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormGroup,
  CInput,
  CLabel,
  CRow,
  CSwitch,
  CDataTable
} from '@coreui/react'

import AddReceiptForm from './AddReceiptForm.js'

const receiptTableFields = [
  'id',
  'name',
  'category',
  'price',
  'qty',
  'total'
]

const AddVisitor = () => {
  const [receiptFormVisibility, setReceiptFormVisibility] = React.useState(false)
  const [showAddReceiptForm, setShowAddReceiptForm] = React.useState(false)

  return (
    <>
      <CRow>
        <CCol xs="12" sm="12">
          <CCard>
            <CCardHeader>
              Add New Visitor
              <small> Form</small>
            </CCardHeader>
            <CCardBody>
              <CCard>
                <CCardBody>
                <CFormGroup>
                  <CLabel htmlFor="emiratesId">Visitors Emirates ID</CLabel>
                  <CInput id="emiratesId" placeholder="Enter Visitor's emirates id" />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="name">Visitors Name</CLabel>
                  <CInput id="name" placeholder="Enter Visitor's name" />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="email">Email</CLabel>
                  <CInput id="email" placeholder="Enter Visitor's email" />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="contact">Phone No</CLabel>
                  <CInput id="contact" placeholder="Enter Phone number" />
                </CFormGroup>
                </CCardBody>
              </CCard>

              <CRow>
                <CCol sm="6">
                  <CCard>
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                      <div>Receipt Form</div>
                      <CSwitch
                        className="mr-1"
                        color="dark"
                        shape="pill"
                        variant="opposite"
                        value={receiptFormVisibility}
                        onChange={e => setReceiptFormVisibility(e.target.checked)}
                      />
                    </CCardHeader>
                    {
                      receiptFormVisibility &&
                      <CCardBody>
                        <CDataTable
                          fields={receiptTableFields}
                          items={[]}
                          footer
                          hover
                          overTableSlot={
                            <div className="text-right">
                              <CButton
                                size="sm"
                                color="primary"
                                variant="outline"
                                className="m-2 pl-3 pr-4"
                                onClick={() => setShowAddReceiptForm(true)}
                              >
                                  <span className="ml-1">Add Item</span>
                              </CButton>
                            </div>
                          }
                        />
                      </CCardBody>
                    }
                  </CCard>
                </CCol>
                <CCol sm="6">
                  <CCard>
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                      <div>Doctor's Visit</div>
                      <CSwitch
                        className="mr-1"
                        color="dark"
                        shape="pill"
                        variant="opposite"
                      />
                    </CCardHeader>
                  </CCard>
                </CCol>
              </CRow>
            </CCardBody>
            <CCardFooter>
              <div className="d-flex">
                <div className="w-50 ml-auto text-right">
                  <CButton className="w-25 mr-1" color="danger">Clear</CButton>
                  <CButton className="w-25" color="primary">Submit</CButton>
                </div>
              </div>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>

      <AddReceiptForm show={showAddReceiptForm} setShow={setShowAddReceiptForm} />
    </>
  )
}

export default AddVisitor
