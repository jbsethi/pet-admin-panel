import React from 'react'
import useAxios from 'axios-hooks'
import TableHeader from '../base/tableHeader/TableHeader'
import AddItem from './AddItem'

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
    'name',
    'price',
    {
      key: 'createdAt',
      label: 'Registered'
    },
    'description',
    'actions'
  ]

const Items = () => {
  const [show, setShow] = React.useState(false)

  const [keyword, setKeyword] = React.useState('')

  const [totalPages, setTotalPages] = React.useState(1)
  const [currentPage, setActivePage] = React.useState(1)

  const [editId, setEditId] = React.useState(null)

  const [{ data, loading, error }, fetch] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/items',
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

  const editModal = (id) => {
    setEditId(id)
    setShow(true)
  }

  const deleteItem = (id) => {
    fetch({
      url: `https://app.aloropivetcenter.com/api/items/${id}`,
      method: 'DELETE'
    })
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
              Items
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
                  <CButton
                    color="primary"
                    variant="outline"
                      className="m-2 pl-3 pr-4"
                      onClick={() => setShow(true)}
                    >
                      <span className="ml-1">Add Item</span>
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
              scopedSlots={{
                'actions':
                  (item) => (
                    <td>
                      <CButton onClick={() => editModal(item.id)} color="primary" size="sm" className="mr-1">Edit</CButton>
                      <CButton onClick={() => deleteItem(item.id)} color="danger" size="sm">Delete</CButton>
                    </td>
                  )
              }}
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <AddItem show={show} setShow={setShow} refetch={fetch} itemId={editId} setEditId={setEditId}/>
    </>
  )
}

export default Items
