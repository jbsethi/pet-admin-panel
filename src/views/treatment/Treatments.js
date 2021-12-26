import React from 'react'
import useAxios from 'axios-hooks'
import { useHistory } from "react-router-dom";

import { formatDate } from '../../utils/dateUtils'
import { PUBLIC_API } from '../../config/index'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
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
  const [pageNo, setPageNo] = React.useState(1)

  const [{ data, loading }, fetch] = useAxios(
    {
      url: PUBLIC_API + '/orders',
      method: 'GET',
    },
    {
      manual: true
    }
  )

  const updatePageNo = (no) => {
    setPageNo(no)
  }

  React.useEffect(() => {
    fetch({
      params: {
        appointment: 1,
        checkUp: false,
        pageNo: pageNo
      }
    }).then(resp => {
      setItems(resp.data.rows.map(row => {
        return {
          orderId: row.id,
          createdAt: row.createdAt,
          ...row.Patient
        }
      }))
    })
  }, [fetch, match.params.id, pageNo])


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
              itemsPerPage={data?.pageSize || 10}
              pagination
              loading={loading}
              onRowClick={(item) => history.push(`/check-up/${item.id}/treatment-${item.orderId}`)}
              scopedSlots={{
                'createdAt': (item) => (
                  <td>
                    {formatDate(item.createdAt)}
                  </td>
                )
              }}
              underTableSlot={
                <CPagination
                  activePage={data?.pageNo || 1}
                  pages={data?.totalPages || 1}
                  onActivePageChange={(i) => updatePageNo(i)}
                ></CPagination>
              }
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Visitors
