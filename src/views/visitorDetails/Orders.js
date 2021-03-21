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
  const [{ data, loading, error }, fetch] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/orders/patient',
      method: 'GET',
    },
    {
      manual: true
    }
  )

  React.useEffect(() => {
    if (id) {
      fetch({
        url: `https://app.aloropivetcenter.com/api/orders/patient/${id}`
      })
    }
  }, [id, fetch])

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
    </CRow>
  )
}

export default Orders
