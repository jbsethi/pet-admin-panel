import React, { lazy, forwardRef, useState, useEffect, useCallback } from 'react'

import useAxios from 'axios-hooks'

import { PUBLIC_API } from '../../config/index'
import { CButton, CSelect } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import "react-datepicker/dist/react-datepicker.css";

import { dateFormat } from 'src/utils/dateUtils'

const DatePicker = lazy(() => import('react-datepicker'))
const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))
const ReportsDropdown = lazy(() => import('../widgets/ReportsDropdown.js'))


const Dashboard = () => {
  const [filterType, setFilterType] = useState('0');
  const [dateRange, setDateRange] = useState([new Date(), null]);
  const [startDate, endDate] = dateRange;

  const [reportStats, setReportStats] = useState({})
  const [dashboardStats, setDastboardStats] = useState({
    items: 0,
    packages: 0,
    orders: 0,
    patients: 0
  })

  const [_, fetchAllStatistics] = useAxios(
    _,
    {
      manual: true
    }
  )

  const [__, fetchReportStatistics] = useAxios(
    _,
    {
      manual: true
    }
  )

  const DatePickerCTA = forwardRef(({ value, onClick }, ref) => (
    <CButton className="d-flex" onClick={onClick} ref={ref} style={{ border: '1px solid #d8dbe0', background: '#fff', fontSize: '16px' }} >
      <span>{value}</span>
      <CIcon className="ml-3" name="cil-calendar"></CIcon>
    </CButton>
  ));

  const populateData = useCallback(async () => {
    try {
      const { data } = await fetchAllStatistics(
        {
          url: PUBLIC_API + '/stats/entities/count',
          method: 'GET',
        }
      )

      setDastboardStats({
        ...data
      })
    }
    catch (err) {
      console.error(err)
    }
  }, [])

  const filterReport = useCallback(async (payload) => {
    try {
      const { data } = await fetchReportStatistics(
        {
          url: PUBLIC_API + '/stats/dashboard/report',
          method: 'POST',
          data: payload
        }
      )

      setReportStats({
        ...data
      })

      console.log(data)
    }
    catch (err) {
      console.error(err)
    }
  }, [])

  const next = () => {
    switch (filterType) {
    case '0':
      setDateRange(dayRange => {
        const [startDate] = dayRange

        const date = new Date(startDate);
        date.setDate(date.getDate() + 1);

        return [date, null]
      })
      break
    case '1':
      setDateRange(dayRange => {
        const [startDate] = dayRange

        const date = new Date(startDate);
        date.setMonth(date.getMonth() + 1);

        return [date, null]
      })
      break
    case '2':
      setDateRange(dayRange => {
        const [startDate, endDate] = dayRange

        const date = new Date(startDate);
        const date2 = new Date(endDate);

        date.setDate(date.getDate() + 7);
        date2.setDate(date2.getDate() + 7);

        return [date, date2]
      })
      break
    default:
      console.log('Filter not recognized')
    }
  }

  const previous = () => {
    switch (filterType) {
    case '0':
      setDateRange(dayRange => {
        const [startDate] = dayRange

        const date = new Date(startDate);
        date.setDate(date.getDate() - 1);

        return [date, null]
      })
      break
    case '1':
      setDateRange(dayRange => {
        const [startDate] = dayRange

        const date = new Date(startDate);
        date.setMonth(date.getMonth() - 1);

        return [date, null]
      })
      break
    case '2':
      setDateRange(dayRange => {
        const [startDate, endDate] = dayRange

        const date = new Date(startDate);
        const date2 = new Date(endDate);

        date.setDate(date.getDate() - 7);
        date2.setDate(date2.getDate() - 7);

        return [date, date2]
      })
      break
    default:
      console.log('Filter not recognized')
    }
  }

  const current = () => {
    switch (filterType) {
    case '2':
      setDateRange(dayRange => {
        const date = new Date();
        const date2 = new Date();

        date2.setDate(date2.getDate() + 7);

        return [date, date2]
      })
      break
    default:
      setDateRange(dayRange => {
        const date = new Date();

        return [date, null]
      })
    }
  }

  useEffect(() => {
    if (filterType === '2') {
      setDateRange(dayRange => {
        const [startDate] = dayRange

        const date = new Date(startDate);
        date.setDate(date.getDate() + 7);

        return [startDate, date]
      })
    } else {
      setDateRange(dayRange => {
        return [dayRange[0], null]
      })
    }
  }, [filterType])

  useEffect(() => {
    const [startDate, endDate] = dateRange;

    const data = {
      fromDate: dateFormat(startDate),
      toDate: dateFormat(endDate ? endDate : startDate)
    };

    if (filterType == '1') {
      const date = new Date(startDate)
      const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0)

      data.fromDate = dateFormat(start)
      data.toDate = dateFormat(end)
    }

    filterReport(data)
  }, [dateRange, filterReport])

  useEffect(() => {
    populateData()
  }, [populateData])


  return (
    <>
      <div>
        <div className="mb-2" >
          <span style={{ fontSize: '22px', fontWeight: '600', color: '#1d273e' }}>Stats</span>
        </div>
        <WidgetsDropdown data={dashboardStats} />
      </div>
      <div className="mt-5">
        <div className="mb-2">
          <span style={{ fontSize: '22px', fontWeight: '600', color: '#1d273e' }}>Report</span>
        </div>
        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <div className="mr-1">
                <CButton onClick={previous} style={{ border: '1px solid #d8dbe0', background: '#fff' }} >
                  <CIcon name="cil-chevron-left"></CIcon>
                </CButton>
                <CButton onClick={next} style={{ border: '1px solid #d8dbe0', background: '#fff' }} >
                  <CIcon name="cil-chevron-right"></CIcon>
                </CButton>
              </div>
              <div className="mr-1">
                <CButton onClick={current} style={{ border: '1px solid #d8dbe0', background: '#fff', fontSize: '16px' }} >Current</CButton>
              </div>
              <div>
                {
                  filterType === '0' &&
                  (
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setDateRange([date, null])}
                      customInput={<DatePickerCTA />}
                    />
                  )
                }
                {
                  filterType === '1' &&
                  (
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setDateRange([date, null])}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      customInput={<DatePickerCTA />}
                    />
                  )
                }
                {
                  filterType === '2' &&
                  (
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => setDateRange(update)}
                      withPortal
                      customInput={<DatePickerCTA />}
                    />
                  )
                }
              </div>
            </div>
            <div>
              <CSelect onChange={(e) => setFilterType(e.target.value)} value={filterType} style={{ fontSize: '16px' }}>
                <option value="0">Daywise</option>
                <option value="1">Monthwise</option>
                <option value="2">Range</option>
              </CSelect>
            </div>
          </div>
        </div>
      </div>
      <ReportsDropdown data={reportStats} />
    </>
  )
}

export default Dashboard
