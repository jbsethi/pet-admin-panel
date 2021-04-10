import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';
import Invoice from './Invoice'
import style from './invoice.module.css'
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

import { AppContext } from '../../App.js'

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
  const { addToast } = React.useContext(AppContext)
  const componentRef = useRef();
  const [showAddItem, setShowAddItem] = React.useState(false)
  const [checkUpPrice, setCheckUpPrice] = React.useState(null)
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
      }).catch(err => {
        addToast({
          message: err.response.data.message
        })
      })
    }
  }

  React.useEffect(() => {
    if (order) {
      console.log(order)
      const items = (order?.Items || []).map((item, idx) => {
        return {
          ...item,
          idx: `i-${idx}`,
          name: item.Item.name,
          qty: item.quantity,
          total: item.quantity * item.price,
          isLocked: true
        }
      })
      const packages = (order?.Packages || []).map((item, idx) => {
        return {
          ...item,
          idx: `p-${idx}`,
          isLocked: true
        }
      })
      console.log(order)
      setItems([...items, ...packages])
      setCheckUpPrice(order.appointment === '1' ? order.checkUpPrice : null)
      setTotal(order.price)
    }
  }, [order, show])

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

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
                <strong>Checkup Price: <span className="text-primary">{checkUpPrice || 0} AED</span></strong> 
              </div>
              <div>
                <strong>Total Bill : <span className="text-primary">{total || 0} AED</span></strong> 
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
      <CModalFooter className="d-flex justify-content-between">
        <div>
        <CButton size="sm" color="info" onClick={handlePrint}>Print Invoice</CButton>
        </div>
        <div>
        <CButton className="mr-1" size="sm" color="danger" onClick={() => setShow(false)}>Cancel</CButton>
        <CButton size="sm" color="primary" onClick={() => handleAction({ type: 'updateReceipt' })}>Update</CButton>
        </div>
      </CModalFooter>
      <div className={style.printable} ref={componentRef}>
        <Invoice data={order} />
      </div>
    </CModal>
  )
}

export default UpdateOrderModal
