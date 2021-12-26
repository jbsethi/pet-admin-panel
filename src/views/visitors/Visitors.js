import React from 'react'
import useAxios from 'axios-hooks'
import { useHistory } from "react-router-dom";
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
  CButton,
  CPagination,
} from '@coreui/react'

import { AppContext } from '../../App.js'

const fields = [
    'name',
    {
      key: 'createdAt',
      label: 'Registered'
    },
    'email',
    'contact'
  ]

const Visitors = () => {
  const { role, addToast } = React.useContext(AppContext)
  const [keyword, setKeyword] = React.useState('')
  const [searchString, setSearchString] = React.useState(undefined)
  const [pageNo, setPageNo] = React.useState(1)

  const history = useHistory()

  const handleClick = () => {
    history.push("/visitors/add")
  }

  const [{ data, loading, error }, fetch] = useAxios(
    {
      url: PUBLIC_API + '/patients',
      method: 'GET',
    },
    {
      manual: true
    }
  )

  const updatePageNo = (no) => {
    setPageNo(no)
  }

  const changeKeyword = (e) => {
    if(e.key === 'Enter') {
      setSearchString(keyword)
    } else {
      setKeyword(e.target.value)
    }
  }

  React.useEffect(() => {
    if (typeof searchString != 'undefined') {
      fetch({
        params: {
          search: searchString,
          pageNo: 1
        }
      }).catch(err => {
        addToast({
          message: err?.response?.data?.message
        })
      })
    }
  }, [fetch, searchString])

  React.useEffect(() => {
    fetch({
      params: {
        search: searchString,
        pageNo: pageNo
      }
    }).catch(err => {
      addToast({
        message: err?.response?.data?.message
      })
    })
  }, [fetch, pageNo])

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
              items={loading ? [] : (error ? [] : data?.rows || [])}
              fields={fields}
              striped
              itemsPerPage={data?.pageSize || 10}
              pagination
              loading={loading}
              onRowClick={(item) => history.push(`/visitors/${item.id}/details`)}
              scopedSlots = {{
                'createdAt':
                  (item) => (
                    <td>
                      {formatDate(item.createdAt)}
                    </td>
                  )
              }}
              overTableSlot={
                role !== 'doctor' &&
                <TableHeader keyword={keyword} changeKeyword={changeKeyword}>
                  <CButton
                    color="primary"
                    variant="outline"
                      className="m-2 pl-3 pr-4"
                      onClick={handleClick}
                    >
                      <span className="ml-1">Add Visit</span>
                    </CButton>
                </TableHeader>
              }
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
