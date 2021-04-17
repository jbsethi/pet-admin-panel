import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import useAxios from 'axios-hooks'
import TableHeader from '../base/tableHeader/TableHeader'

import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CButton
} from '@coreui/react'

import { AppContext } from '../../App.js'

const fields = [
  { key: 'name', _classes: 'font-weight-bold' },
  'email',
  'username',
  'role',
  {
    key: 'createdAt',
    label: 'Registered'
  },
  'active'
]

const getBadge = status => {
  if (status) {
    return 'success'
  } else {
    return 'danger'
  }
}

const Users = () => {
  const [keyword, setKeyword] = React.useState('')
  const { addToast } = useContext(AppContext)
  const history = useHistory()
  const [totalPages, setTotalPages] = React.useState(1)
  const [currentPage, setActivePage] = React.useState(1)

  const [{ data, loading, error }, refetch] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/users',
      method: 'GET',
      params: {
        pageNo: currentPage
      }
    },
    {
      manual: true
    }
  )

  React.useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages)
    }
  }, [data])


  React.useEffect(() => {
    refetch().catch(err => {
      addToast({
        message: err?.response?.data?.message || 'Error Occured try again later !'
      })
    })
  }, [refetch])

  const changeKeyword = (e) => {
    if(e.key === 'Enter') {
      refetch({
        params: {
          search: keyword
        }
      }).catch(err => {
        addToast({
          message: err?.response?.data?.message || 'Error Occured try again later !'
        })
      })
    } else {
      setKeyword(e.target.value)
    }
  }

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            Users
          </CCardHeader>
          <CCardBody>
          <CDataTable
            items={loading ? [] : (error ? [] : data?.rows || [])}
            fields={fields}
            striped
            itemsPerPage={10}
            loading={loading}
            clickableRows
            onRowClick={(item) => history.push(`/users/${item.id}`)}
            overTableSlot={
              <TableHeader keyword={keyword} changeKeyword={changeKeyword}>
                <CButton
                  color="primary"
                  variant="outline"
                    className="m-2 pl-3 pr-4"
                    onClick={() => history.push('/users/add')}
                  >
                    <span className="ml-1">Add New User</span>
                  </CButton>
              </TableHeader>
            }
            underTableSlot={
              <CPagination
                activePage={currentPage}
                pages={totalPages}
                onActivePageChange={(i) => setActivePage(i)}
              ></CPagination>
            }
            scopedSlots = {{
              'active':
                (item)=>(
                  <td>
                    <CBadge color={getBadge(item.active)}>
                      {item.active  ? 'Active' : 'Inactive'}
                    </CBadge>
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

export default Users
