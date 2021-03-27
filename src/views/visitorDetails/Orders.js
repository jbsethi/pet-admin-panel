import React from 'react'

import useAxios from 'axios-hooks'

import {
  CCard,
  CCol,
  CRow,
  CCardHeader,
  CCardBody,
  CDataTable,
} from '@coreui/react'

import UpdateOrderModal from './UpdateOrderModal.js'

const fields = [
  'id',
  {
    key: 'createdAt',
    label: 'Registered'
  },
  {
    key: 'checkUpPrice',
    label: 'Doctor\'s Fee'
  },
  {
    key: 'price',
    label: 'Total Bill'
  }
]

const Orders = ({ id }) => {
  const [show, setShow] = React.useState(false)
  const [orderData, setOrderData] = React.useState(null)

  const [{ data, loading, error }, fetch] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/orders/patient',
      method: 'GET',
    },
    {
      manual: true
    }
  )

  const loadData = React.useCallback(() => {
    fetch({
      url: `https://app.aloropivetcenter.com/api/orders/patient/${id}`
    })
  }, [fetch])

  React.useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id, loadData])

  const toggleModal = (status, item = null) => {
    setOrderData(item)
    setShow(status)
  }

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>Visitor Orders</CCardHeader>
          <CCardBody>
            <CDataTable
              items={loading ? [] : (error ? [] : data?.rows || [])}
              fields={fields}
              striped
              pagination
              loading={loading}
              onRowClick={(item) => toggleModal(true, item)}
              overTableSlot={
                <p>All Pets</p>
              }
              scopedSlots = {{
                'checkUpPrice':
                  (item)=>(
                    <td>
                      { `${item.checkUpPrice} AED` }
                    </td>
                  ),
                'price':
                  (item)=>(
                    <td>
                      { `${item.price} AED` }
                    </td>
                  )
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <UpdateOrderModal show={show} setShow={toggleModal} order={orderData} refetch={loadData} />
    </CRow>
  )
}

export default Orders
