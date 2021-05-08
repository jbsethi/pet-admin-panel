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
  'action',
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

  const handleAction = (data) => {
    console.log(data.payload)
    dispatch(data)
  }

  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div><strong>Shopping, Grooming and Others</strong></div>
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
              scopedSlots={{
                'action':
                  (item)=>(
                    <td className="px-1 py-2">
                    {
                      <CButton onClick={() => handleAction({ type: 'removeItem', payload: item })} size="sm">&#10006;</CButton>
                    }
                    </td>
                  )
              }}
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
