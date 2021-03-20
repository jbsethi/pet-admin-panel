import React from 'react'
import useAxios from 'axios-hooks'
import { useHistory } from "react-router-dom";
import TableHeader from '../base/tableHeader/TableHeader'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
} from '@coreui/react'

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
  const history = useHistory()

  const handleClick = () => {
    history.push("/visitors/add")
  }

  const [{ data, loading, error }] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/patients',
      method: 'GET',
    },
  )

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
              items={loading ? [] : (error ? [] : data.rows)}
              fields={fields}
              striped
              itemsPerPage={5}
              pagination
              loading={loading}
              onRowClick={(item) => history.push(`/visitors/${item.id}/details`)}
              overTableSlot={
                <TableHeader>
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
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Visitors
