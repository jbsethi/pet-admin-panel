import React, { lazy } from 'react'

import useAxios from 'axios-hooks'

import { PUBLIC_API } from '../../config/index'
import { CButton, CInput, CSelect } from '@coreui/react'
import CIcon from '@coreui/icons-react'


const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))

const Dashboard = () => {
  const [{ data, loading, error }, fetch] = useAxios(
    {
      url: PUBLIC_API + '/stats/entities/count',
      method: 'GET'
    },
    {
      manual: true
    }
  )

  React.useEffect(() => {
    fetch()
  }, [])


  return (
    <>
      <div>
        <div className="mb-2" >
          <span style={{ fontSize: '22px', fontWeight: '600', color: '#1d273e' }}>Stats</span>
        </div>
        <WidgetsDropdown data={data} />
      </div>
      <div className="mt-5">
        <div className="mb-2">
          <span style={{ fontSize: '22px', fontWeight: '600', color: '#1d273e' }}>Report</span>
        </div>
        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <div className="mr-1">
                <CButton style={{ border: '1px solid #d8dbe0', background: '#fff' }} >
                  <CIcon name="cil-chevron-left"></CIcon>
                </CButton>
                <CButton style={{ border: '1px solid #d8dbe0', background: '#fff' }} >
                  <CIcon name="cil-chevron-right"></CIcon>
                </CButton>
              </div>
              <div className="mr-1">
                <CButton style={{ border: '1px solid #d8dbe0', background: '#fff', fontSize: '16px' }} >Current</CButton>
              </div>
              <div>
                <CInput type="date" style={{ fontSize: '16px' }}></CInput>
              </div>
            </div>
            <div>
              <CSelect style={{ fontSize: '16px' }}>
                <option value="0">Daywise</option>
                <option value="1">Monthwise</option>
              </CSelect>
            </div>
          </div>
        </div>
      </div>
      <WidgetsDropdown data={data} />
    </>
  )
}

export default Dashboard
