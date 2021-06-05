import React from 'react'
import useAxios from 'axios-hooks'
import TableHeader from '../base/tableHeader/TableHeader'

import { formatDate } from '../../utils/dateUtils'

import { PUBLIC_API } from '../../config/index'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination
} from '@coreui/react'

const fields = [
    {
      key: 'displayName',
      label: 'Name'
    },
    {
      key: 'createdAt',
      label: 'Registered'
    },
    'description',
  ]

const Roles = () => {
  const [keyword, setKeyword] = React.useState('')

  const [totalPages, setTotalPages] = React.useState(1)
  const [currentPage, setActivePage] = React.useState(1)

  const [{ data, loading, error }, fetch] = useAxios(
    {
      url: PUBLIC_API + '/roles',
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

  React.useEffect(() => {
    fetch()
      .then(resp => {
        setTotalPages(resp.data.totalPages)
      })
  }, [fetch])

  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              Roles
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={loading ? [] : (error ? [] : data?.rows || [])}
              fields={fields}
              striped
              itemsPerPage={10}
              loading={loading}
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
              scopedSlots={{
                'createdAt':
                  (item) => (
                    <td>
                      {formatDate(item.createdAt)}
                    </td>
                  )
              }}
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Roles
