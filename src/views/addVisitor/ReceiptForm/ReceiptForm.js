import React from 'react'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CSwitch,
  CDataTable
} from '@coreui/react'

import AddReceiptForm from './AddReceiptForm.js'

const receiptTableFields = [
  'name',
  'category',
  'price',
  'qty',
  'total'
]

const ReceiptForm = ({ receiptFormVisibility, showAddReceiptFormModal, receiptItems, dispatch }) => {
  const showAddReceiptForm = (status) => {
    dispatch({ type: 'setShowAddReceiptForm', payload: status })
  }

  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>Receipt Form</div>
          <CSwitch
            className="mr-1"
            color="dark"
            shape="pill"
            variant="opposite"
            value={receiptFormVisibility}
            onChange={e => dispatch({ type: 'setReceiptFormVisibility', payload: e.target.checked })}
          />
        </CCardHeader>
        {
          receiptFormVisibility &&
          <CCardBody>
            <CDataTable
              fields={receiptTableFields}
              items={receiptItems || []}
              footer
              hover
              overTableSlot={
                <div className="text-right">
                  <CButton
                    size="sm"
                    color="primary"
                    variant="outline"
                    className="m-2 pl-3 pr-4"
                    onClick={() => showAddReceiptForm(true)}
                  >
                      <span className="ml-1">Add Item</span>
                  </CButton>
                </div>
              }
            />
          </CCardBody>
        }
      </CCard>

      <AddReceiptForm show={showAddReceiptFormModal} setShow={showAddReceiptForm} dispatch={dispatch}/>
    </>
  )
}

export default ReceiptForm
