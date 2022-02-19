import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print';
import Invoice from './Invoice'
import style from './invoice.module.css'
import styleItems from '../items/items.module.css'
import {
  CLabel,
  CSwitch,
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
import { PUBLIC_API } from '../../config/index'

const receiptTableFields = [
  {
    label: '',
    key: 'actions'
  },
  'name',
  'category',
  'price',
  {
    key: 'vat',
    label: 'Vat price',
  },
  'qty',
  'discount',
  'total',
]

const UpdateOrderModal = ({ show, setShow, order, patientData, refetch, disableUpdate }) => {
  const [vatPercentage, setVatPercentage] = React.useState('5')
  const { addToast } = React.useContext(AppContext)
  const componentRef = useRef();
  const [showAddItem, setShowAddItem] = React.useState(false)
  const [isVatIncluded, setIsVatIncluded] = React.useState(false)
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
      const price = (payload.itemId?.price || payload.packageId?.price);
      const discountedPrice = price - (price * (payload.discount || 0)) / 100

      const item = {
        idx: `n-${items.length}`,
        itemId: payload.itemId?.value || null,
        packageId: payload.packageId?.value || null,
        name: payload.itemId?.label || payload.packageId?.label,
        category: payload.categoryId.label,
        price: price,
        qty: payload.quantity,
        total: payload.quantity * discountedPrice,
        discount: payload.discount || 0,
        isLocked: false
      }

      setItems((oldItems) => {
        let isUpdate = false;

        const newList = oldItems.map(oldItem => {
          if (!oldItem.id && oldItem.itemId === item.itemId) {
            oldItem.qty += item.qty
            isUpdate = true;
          }

          return oldItem;
        })

        if (isUpdate) return newList

        return [...oldItems, item]
      })
      setTotal((oldPrice => (oldPrice + item.total)))
    } else if (type === 'removeItem') {
      const price = items.find(i => i.idx === payload)?.price || 0
      setItems((oldItems) => oldItems.filter(i => i.idx !== payload))
      setTotal((oldPrice => (oldPrice - price)))
    } else if (type === 'updateReceipt') {
      const data = {
        items: items.filter(item => (item.itemId && !item.id)).map(item => {
          return {
            itemId: item.itemId,
            quantity: item.quantity || item.qty,
            discount: item.discount || 0
          }
        }),
        packages: items.filter(item => (item.packageId && !item.id)).map(item => {
          return {
            packageId: item.packageId,
            quantity: item.quantity || item.qty,
            discount: item.discount || 0
          }
        })
      }

      fetch({
        url: PUBLIC_API + `/orders/${order.id}`,
        data
      }).then(() => {
        refetch()
        setShow(false)
      }).catch(err => {
        addToast({
          message: err?.response?.data?.message || 'Error occured please try again later !'
        })
      })
    }
  }

  React.useEffect(() => {
    if (order) {
      const items = (order?.Items || []).map((item, idx) => {
        return {
          ...item,
          idx: `i-${idx}`,
          name: item.Item.name,
          category: item.Item.Service.name,
          qty: item.quantity,
          price: item.itemPrice || item.price / item.quantity,
          total: item.price,
          isLocked: true
        }
      })
      const packages = (order?.Packages || []).map((item, idx) => {
        return {
          ...item,
          idx: `p-${idx}`,
          name: item.Package.name,
          category: item.Package.Service.name,
          qty: item.quantity,
          price: item.itemPrice || item.price / item.quantity,
          total: item.price,
          isLocked: true
        }
      })
      setItems([...items, ...packages])
      setCheckUpPrice(order.appointment === '1' ? order.checkUpPrice : null)
      setTotal(order.price)
    }
  }, [order, show])

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  React.useEffect(() => {
    if (order) {
      if (isVatIncluded) {
        setTotal(order.price + ((order.price * (vatPercentage / 100))))
      } else {
        setTotal(order.price)
      }
    }
  }, [isVatIncluded, vatPercentage, total, order])

  return (
    <CModal
      size="lg"
      show={show}
      onClose={() => setShow(false)}
    >
      <CModalHeader>Shopping, Grooming and others</CModalHeader>
      <CModalBody>
        <CDataTable
          fields={receiptTableFields.filter(field => !disableUpdate || field.key !== 'actions')}
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
              {
                !disableUpdate &&
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
              }
            </div>
          }
          scopedSlots={{
            'vat': (item) => (<td>
              {item.price * (isVatIncluded ? (vatPercentage / 100) : 0)}
            </td>),
            'discount': (item) => (<td>{`${item.discount} %`}</td>),
            'total': (item) => (<td>
              {item.total + (isVatIncluded ? (item.total * (vatPercentage / 100)) : 0)}
            </td>),
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
        <div className="d-flex">
        <CButton size="sm" color="info" onClick={handlePrint}>Print Invoice</CButton>

        <CLabel htmlFor="vat" className="ml-4">
          Apply <span className={styleItems['inline-input-span']}>
            <input style={{
              width: `${15 + ((vatPercentage.length - 1)*8)}px`
            }} className={styleItems['inline-input']} value={vatPercentage} onChange={(e) => setVatPercentage(e.target.value)}/>%
          </span> vat on all items.
        </CLabel>
        <CSwitch
          className="pl-1 ml-1"
          color="primary"
          name="vat"
          value={isVatIncluded}
          onChange={(e) => setIsVatIncluded(e.target.checked)}
          {
            ...({
              variant: 'opposite',
              shape:'pill'
            })
          }
        />
        </div>
        <div>
        <CButton className="mr-1" size="sm" color="danger" onClick={() => setShow(false)}>Cancel</CButton>
        {
          !disableUpdate &&
          <CButton size="sm" color="primary" onClick={() => handleAction({ type: 'updateReceipt' })}>Update</CButton>
        }
        </div>
      </CModalFooter>
      <div className={style.printable} ref={componentRef}>
        <Invoice data={order} patientData={patientData} total={total} vatPercentage={vatPercentage} isVatIncluded={isVatIncluded}/>
      </div>
    </CModal>
  )
}

export default UpdateOrderModal
