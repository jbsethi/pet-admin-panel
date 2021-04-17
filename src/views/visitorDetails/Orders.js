import React, { useContext } from 'react'

import useAxios from 'axios-hooks'

import { withRouter } from 'react-router-dom'

import {
  CCard,
  CCol,
  CRow,
  CCardHeader,
  CCardBody,
  CDataTable,
} from '@coreui/react'

import { AppContext } from '../../App.js'

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

const Orders = ({ history, id }) => {
  const { role, addToast } = useContext(AppContext)
  const [show, setShow] = React.useState(false)
  const [orderData, setOrderData] = React.useState(null)
  const [patientData, setPatientData] = React.useState(null)

  const [{ data, loading, error }, fetch] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/orders/patient',
      method: 'GET',
    },
    {
      manual: true
    }
  )

  const loadData = React.useCallback(async (orderId) => {
    try {
      const resp = await fetch({
        url: `https://app.aloropivetcenter.com/api/orders/patient/${id}`
      })

      setPatientData(resp.data.Patient)
  
      if (orderId) {
        toggleModal(true, resp.data.rows.find(row => row.id === orderId))
      }
    } catch (err) {
      addToast({
        message: err?.response?.data?.message || 'Something went wrong !'
      })
    }
  }, [fetch])

  React.useEffect(() => {
    if (id) {
      const orderId = history?.location?.state?.orderId || null
      loadData(orderId)
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
      <UpdateOrderModal show={show} setShow={toggleModal} order={orderData} patientData={patientData} refetch={loadData} />
    </CRow>
  )
}

export default withRouter(Orders)
