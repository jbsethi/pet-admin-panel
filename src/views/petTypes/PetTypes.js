import React from 'react'
import useAxios from 'axios-hooks'
import TableHeader from '../base/tableHeader/TableHeader'
import AddPetRecord from './AddPetRecord'

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
    {
      key: 'createdAt',
      label: 'Registered'
    },
    'description',
    'actions'
  ]

const PetTypes = () => {
  const [show, setShow] = React.useState(false)
  const [totalPages, setTotalPages] = React.useState(1)
  const [currentPage, setActivePage] = React.useState(1)

  const [editId, setEditId] = React.useState(null)

  const [{ data, loading, error }, refetch] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/pet-types',
      method: 'GET',
      params: {
        pageNo: currentPage
      }
    },
    {
      manual: true
    }
  )

  const [{ data: singleData, loading: singleLoading, error: singleError }, removeItem] = useAxios(
    {
      url: `https://app.aloropivetcenter.com/api/pet-types`,
      method: 'DELETE'
    },
    {
      manual: true
    }
  )

  const editModal = (id) => {
    setEditId(id)
    setShow(true)
  }

  const deleteItem = (id) => {
    removeItem({
      url: `https://app.aloropivetcenter.com/api/pet-types/${id}`,
    })
  }

  React.useEffect(() => {
    if (data) {
      if (data?.totalPages) {
        setTotalPages(data.totalPages)
      }
    } else {
      refetch()
    }
  }, [data])

  React.useEffect(() => {
    if (singleData) {
      refetch()
    }
  }, [singleData])

  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              Pet Types
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={loading ? [] : (error ? [] : data?.rows || [])}
              fields={fields}
              striped
              itemsPerPage={10}
              loading={loading}
              overTableSlot={
                <TableHeader>
                  <CButton
                    color="primary"
                    variant="outline"
                      className="m-2 pl-3 pr-4"
                      onClick={() => setShow(true)}
                    >
                      <span className="ml-1">Add Pet Type</span>
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

      <AddPetRecord show={show} setShow={setShow} refetch={refetch} petTypeId={editId} setEditId={setEditId}/>
    </>
  )
}

export default PetTypes
