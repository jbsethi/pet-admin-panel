import React, {useState, useEffect} from 'react'
import useAxios from 'axios-hooks'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination
} from '@coreui/react'


import { PUBLIC_API } from '../../config/index'
import TableHeader from '../base/tableHeader/TableHeader'

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

const Orders = () => {
  const [keyword, setKeyword] = useState('')
  const [totalPages, setTotalPages] = React.useState(1)
  const [currentPage, setActivePage] = React.useState(1)

  const [{ data, loading }, fetch] = useAxios(
    {
      url: PUBLIC_API + '/orders',
      method: 'GET',
      params: {
        pageNo: currentPage
      }
    },
    {
      manual: true
    }
  )

  const changeKeyword = (e) => {
    if(e.key === 'Enter') {
      fetch({
        params: {
          search: keyword
        }
      })
    } else {
      setKeyword(e.target.value)
    }
  }


  useEffect(() => {
    fetch()
      .catch(err => {
        console.log(err.response)
      })
  }, [])

  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              Orders
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={loading ? [] : data?.rows || []}
              fields={fields}
              striped
              itemsPerPage={10}
              loading={false}
              overTableSlot={
                <TableHeader keyword={keyword} changeKeyword={changeKeyword}>
                </TableHeader>
              }
              underTableSlot={
                <CPagination
                  activePage={currentPage}
                  pages={totalPages}
                  onActivePageChange={(i) => setActivePage(i)}
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

export default Orders