import {useState, useEffect, useContext} from 'react'
import useAxios from 'axios-hooks'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CSelect,
  CButton
} from '@coreui/react'

import { datesObj } from 'src/utils/dateUtils'


import { PUBLIC_API } from '../../config/index'
import TableHeader from '../base/tableHeader/TableHeader'

import { AppContext } from '../../App.js'

import UpdateOrderModal from '../visitorDetails/UpdateOrderModal'

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
  const { role, addToast } = useContext(AppContext)
  const [keyword, setKeyword] = useState('')
  const [show, setShow] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const [patientData, setPatientData] = useState({})
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setActivePage] = useState(1)
  const [filterType, setFilterType] = useState(1);
  const [totalRecords, setTotalRecords] = useState(null);

  const [dayRange, setDayRange] = useState([]);

  const [{ data, loading }, fetch] = useAxios(
    {
      url: PUBLIC_API + 'orders',
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

  const toggleModal = (status, item = null) => {
    setOrderData(item)
    setShow(status)
  }

  const changeDayFilter = (e) => {
    const date = new Date(e.target.value);
    const fromDate = `${date.getFullYear()}-${('0'+(date.getMonth()+1)).slice(-2)}-${date.getDate()}`

    setDayRange([fromDate, fromDate]);
  }

  const changeDateRangeFilter = (e) => {
    const date = new Date(e.target.value);
    const range = `${date.getFullYear()}-${('0'+(date.getMonth()+1)).slice(-2)}-${date.getDate()}`

    if (e.target.name === 'to') {
      if (datesObj.compare(dayRange[0], range) > 0) {
        e.target.value = Date.now();
        addToast({
          message: 'To date should be greater than from date !'
        })
      } else {
        setDayRange(ranges => {
          return [ ranges[0], range ]
        });
      }
    } else {
      if (datesObj.compare(range, dayRange[1]) > 0) {
        e.target.value = Date.now();
        addToast({
          message: 'To date should be greater than from date !'
        })
      } else {
        setDayRange(ranges => {
          return [ range, ranges[1] ]
        });
      }
    }
  }

  const fetchOrders = () => {
    fetch({
      params: {
        pageNo: currentPage,
        fromDate: dayRange[0],
        toDate: dayRange[1]
      }
    })
      .then(res => {
        setTotalRecords(res?.data?.count || 0)
      })
      .catch(err => {
        console.log(err.response)
      })
  }

  useEffect(() => {
    if (!dayRange.length) {
      const date = new Date();
      const fromDate = `${date.getFullYear()}-${('0'+(date.getMonth()+1)).slice(-2)}-${date.getDate()}`
      setDayRange([fromDate, fromDate]);
    }
  }, [dayRange.length])

  useEffect(() => {
    fetchOrders()
  }, [dayRange, currentPage, fetch])

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
              onRowClick={(item) => toggleModal(true, item)}
              overTableSlot={
                <>
                <TableHeader keyword={keyword} changeKeyword={changeKeyword}>
                </TableHeader>
                <div className="d-flex justify-content-between pb-3">
                  <div className="d-flex">
                  <div style={{ marginRight: '10px' }}>
                    <CButton onClick={() => {
                      setFilterType(1)
                      const date = new Date();
                      const fromDate = `${date.getFullYear()}-${('0'+(date.getMonth()+1)).slice(-2)}-${date.getDate()}`
                      setDayRange([fromDate, fromDate]);
                    }} style={{ border: '1px solid #d8dbe0' }} >Current</CButton>
                  </div>
                  <CSelect
                    custom
                    name="order"
                    onChange={(e) => setFilterType(+e.target.value)}
                  >
                    <option value="1">Filter by Date</option>
                    <option value="2">Filter By Range</option>
                  </CSelect>
                  </div>
                  {
                    filterType === 1 ?
                      <div className="d-flex align-items-center">
                        <label className="mb-0">Filter by Date: </label>
                        <input onChange={changeDayFilter} className="ml-2" type="date" />
                      </div>:
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          <label className="mb-0">Filter From: </label>
                          <input onChange={changeDateRangeFilter} className="ml-2" type="date" name="from"/>
                        </div>
                        <div className="d-flex align-items-center ml-3">
                          <label className="mb-0">Filter To: </label>
                          <input onChange={changeDateRangeFilter} className="ml-2" type="date" name="to" />
                        </div>
                      </div>
                  }
                </div>

                <div className="d-flex" style={{ gap: '30px', justifyContent: 'space-between' }}>
                <div style={{ paddingBottom: '5px', color: '#1d273e', fontWeight: '600'}}>Total Orders: <span>{totalRecords}</span></div>
                <div><span style={{ paddingBottom: '5px', color: '#1d273e', fontWeight: '600' }}>Showing results for :</span> <span>{dayRange[0]}</span> { filterType == 2 && <span>: {dayRange[1]}</span>}</div>
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
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <UpdateOrderModal refetch={fetchOrders} show={show} setShow={toggleModal} order={orderData} patientData={patientData} />
    </>
  )
}

export default Orders
