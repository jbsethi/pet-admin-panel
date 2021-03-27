import React from 'react'

import {
  CModal,
  CModalHeader,
  CModalFooter,
  CModalBody,
  CButton,
  CDataTable
} from '@coreui/react'

import AddReceiptForm from '../addVisitor/ReceiptForm/AddReceiptForm'

import useAxios from 'axios-hooks'

const receiptTableFields = [
  {
    label: '',
    key: 'actions'
  },
  'name',
  'category',
  'price',
  'qty',
  'total',
]

const UpdateOrderModal = ({ show, setShow, order, refetch }) => {
  const [showAddItem, setShowAddItem] = React.useState(false)
  const [total, setTotal] = React.useState(null)
  const [items, setItems] = React.useState([])

  const [, fetch] = useAxios(
    {
      url: null,
      method: 'PUT',
    },
    {
      manual: true
    }
  )

  const handleAction = ({ type, payload }) => {
    if (type === 'addItemInReceipt') {
      const item = {
        idx: `n-${items.length}`,
        itemId: payload.itemId?.value || null,
        packageId: payload.packageId?.value || null,
        name: payload.itemId?.label || payload.packageId?.label,
        category: payload.categoryId.label,
        price: payload.itemId?.price || payload.packageId?.price,
        qty: payload.quantity,
        total: payload.quantity * (payload.itemId?.price || payload.packageId?.price),
        isLocked: false
      }

      setItems((oldItems) => [...oldItems, item])
      setTotal((oldPrice => (oldPrice + item.total)))
    } else if (type === 'removeItem') {
      const price = items.find(i => i.idx === payload)?.price || 0
      setItems((oldItems) => oldItems.filter(i => i.idx !== payload))
      setTotal((oldPrice => (oldPrice - price)))
    } else if (type === 'updateReceipt') {
      console.log(order)
      const data = {
        patientId: order.patientId,
        appointment: +order.appointment === 1,
        checkUpPrice: order.checkUpPrice,
        description: order.description,
        followUp: order.followUp,
        itemIds: items.filter(item => item.itemId).map(item => item.itemId),
        packageIds: items.filter(item => item.packageId).map(item => item.packageId)
      }

      fetch({
        url: `https://app.aloropivetcenter.com/api/orders/${order.id}`,
        data
      }).then(() => {
        refetch()
        setShow(false)
      })
    }
  }

  React.useEffect(() => {
    console.log(order)
    if (order) {
      const items = order.Items.map((item, idx) => {
        return {
          ...item,
          idx: `i-${idx}`,
          isLocked: true
        }
      })
      const packages = order.Packages.map((item, idx) => {
        return {
          ...item,
          idx: `p-${idx}`,
          isLocked: true
        }
      })

      setItems([...items, ...packages])
      setTotal(order.price)
    }
  }, [order, show])

  return (
    <CModal
      show={show}
      onClose={() => setShow(false)}
    >
      <CModalHeader>Shopping, Grooming and others</CModalHeader>
      <CModalBody>
        <CDataTable
          fields={receiptTableFields}
          items={items || []}
          footer
          hover
          overTableSlot={
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Total Bill Amount : <span className="text-primary">{total || 0} AED</span></strong> 
              </div>
              <div className="text-right">
                <CButton
                  size="sm"
                  color="primary"
                  variant="outline"
                  className="m-2 pl-3 pr-4"
                  onClick={() => setShowAddItem(true)}
                >
                    <span className="ml-1">Add Item</span>
                </CButton>
              </div>
            </div>
          }
          scopedSlots={{
            'actions':
                  (item)=>(
                    <td className="px-1 py-2">
                    {
                      !item.isLocked &&
                      <CButton onClick={() => handleAction({ type: 'removeItem', payload: item.idx })} size="sm">&#10006;</CButton>
                    }
                    </td>
                  )
          }}
        />

        <AddReceiptForm  show={showAddItem} setShow={setShowAddItem}  dispatch={handleAction}></AddReceiptForm>
      </CModalBody>
      <CModalFooter>
        <CButton size="sm" color="danger" onClick={() => setShow(false)}>Cancel</CButton>
        <CButton size="sm" color="primary" onClick={() => handleAction({ type: 'updateReceipt' })}>Update</CButton>
      </CModalFooter>
    </CModal>
  )
}

export default UpdateOrderModal
