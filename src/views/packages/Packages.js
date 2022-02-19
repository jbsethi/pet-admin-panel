import React, {useContext} from 'react'
import useAxios from 'axios-hooks'
import TableHeader from '../base/tableHeader/TableHeader'
import AddPackage from './AddPackage'

import { formatDate } from '../../utils/dateUtils'

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

import { AppContext } from '../../App.js'
import { PUBLIC_API } from '../../config/index'

import style from '../items/items.module.css'

const fields = [
    'name',
    'price',
    {
      key: 'vat',
      label: 'Vat Price'
    },
    'total',
    {
      key: 'createdAt',
      label: 'Registered'
    },
    'description',
    'actions'
  ]

const Packages = () => {
  const [vatPercentage, setVatPercentage] = React.useState('5')
  const { addToast, role } = useContext(AppContext)
  const [show, setShow] = React.useState(false)

  const [keyword, setKeyword] = React.useState('')

  const [totalPages, setTotalPages] = React.useState(1)
  const [currentPage, setActivePage] = React.useState(1)

  const [editId, setEditId] = React.useState(null)

  const [{ data, loading, error }, fetch] = useAxios(
    {
      url: PUBLIC_API + '/packages',
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

  const loadData = React.useCallback(() => {
    fetch()
      .then(resp => {
        setTotalPages(resp.data.totalPages)
      })
  }, [fetch])

  const deleteItem = (id) => {
    fetch({
      url: PUBLIC_API + `/packages/${id}`,
      method: 'DELETE'
    }).then(() => {
      loadData()
    })
  }

  React.useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              Packages
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={loading ? [] : (error ? [] : data?.rows || [])}
              fields={fields}
              striped
              itemsPerPage={10}
              loading={loading}
              overTableSlot={
                <>
                <TableHeader keyword={keyword} changeKeyword={changeKeyword}>
                  <CButton
                    color="primary"
                    variant="outline"
                      className="m-2 pl-3 pr-4"
                      onClick={() => setShow(true)}
                    >
                      <span className="ml-1">Add Package</span>
                    </CButton>
                </TableHeader>
                <div className='ml-1 mb-2 d-flex align-items-center'>
                <div className={style['vat']}>
                  Apply <span className={style['inline-input-span']}>
                    <input style={{
                      width: `${15 + ((vatPercentage.length - 1)*8)}px`
                    }} className={style['inline-input']} value={vatPercentage} onChange={(e) => setVatPercentage(e.target.value)}/>%
                  </span> vat on all items.
                </div>
              </div>
              </>
              }
              underTableSlot={
                <CPagination
                  activePage={currentPage}
                  pages={totalPages}
                  onActivePageChange={(i) => setActivePage(i)}
                ></CPagination>
              }
              scopedSlots={{
                'vat':
                  (item) => (
                    <td>
                      {(item.price * +vatPercentage)/100} AED
                    </td>
                  ),
                'total':
                  (item) => (
                    <td>
                      {item.price + ((item.price * +vatPercentage)/100)} AED
                    </td>
                  ),
                'createdAt':
                  (item) => (
                    <td>
                      {formatDate(item.createdAt)}
                    </td>
                  ),
                'actions':
                  (item) => (
                    <td>
                      <CButton onClick={() => editModal(item.id)} color="primary" size="sm" className="mr-1">Edit</CButton>
                      {
                        role !== 'receptionist' &&
                      <CButton onClick={() => deleteItem(item.id)} color="danger" size="sm">Delete</CButton>
                      }
                    </td>
                  )
              }}
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <AddPackage show={show} setShow={setShow} refetch={fetch} itemId={editId} setEditId={setEditId}/>
    </>
  )
}

export default Packages
