import { CCard, CCardBody, CCardHeader, CRow, CCol, CDataTable } from '@coreui/react'

import React from 'react'
import useAxios from 'axios-hooks'

const fields = [
  'id',
  'name',
  'color',
  'pet'
]

const PetRecords = ({ id }) => {
  const [{ data, loading, error }, fetch] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/pets/all/patients',
      method: 'POST',
    },
    {
      manual: true
    }
  )

  React.useEffect(() => {
    if (id) {
      fetch({
        data: {
          patientId: id
        }
      })
    }
  }, [id, fetch])

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>Visitor Pets</CCardHeader>
          <CCardBody>
          <CRow className="py-2">
            <CCol md="4">
              <CCard>
                <CCardBody>
                  {
                    <>
                      
                          <CDataTable
                            items={loading ? [] : (error ? [] : data?.rows || [])}
                            fields={fields}
                            striped
                            pagination
                            loading={loading}
                            overTableSlot={
                              <p>All Pets</p>
                            }
                          />
                        
                    </>
                  }
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
  )
}

export default PetRecords
