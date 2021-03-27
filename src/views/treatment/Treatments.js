import React from 'react'
import useAxios from 'axios-hooks'
import { useHistory } from "react-router-dom";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
} from '@coreui/react'


const fields = [
    'name',
    {
      key: 'createdAt',
      label: 'Registered'
    },
    'email',
    'contact'
  ]

const Visitors = ({ match }) => {
  const history = useHistory()
  const [items, setItems] = React.useState([])

  const [{ loading }, fetch] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/orders',
      method: 'GET',
    },
    {
      manual: true
    }
  )

  React.useEffect(() => {
    fetch({
      params: {
        appointment: 1
      }
    }).then(resp => {
      setItems(resp.data.rows.map(row => {
        return {
          orderId: row.id,
          ...row.Patient
        }
      }))
    })
  }, [fetch, match.params.id])
  

  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              Visitors
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={loading ? [] : items}
              fields={fields}
              striped
              itemsPerPage={5}
              pagination
              loading={loading}
              onRowClick={(item) => history.push(`/check-up/${item.id}/treatment-${item.orderId}`)}
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Visitors