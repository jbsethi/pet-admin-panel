import React from 'react'
import useAxios from 'axios-hooks'
import TableHeader from '../base/tableHeader/TableHeader'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
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
      url: 'https://app.aloropivetcenter.com/api/roles',
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
  }, [])

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
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Roles
