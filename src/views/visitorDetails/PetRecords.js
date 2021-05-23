import { CCard, CCardBody, CCardHeader, CRow, CCol, CDataTable, CFormGroup, CLabel, CInput, CSwitch } from '@coreui/react'

import React from 'react'
import useAxios from 'axios-hooks'

const fields = [
  'id',
  'name',
  'color',
  'specie'
]

const PetRecords = ({ id }) => {
  const [petRecord, setPetRecord] = React.useState(null)
  const [{ data, loading, error }, fetch] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/pets/all/patients',
      method: 'POST',
    },
    {
      manual: true
    }
  )

  const showPetDetails = (pet) => {
    setPetRecord(pet)
  }

  React.useEffect(() => {
    if (id) {
      fetch({
        data: {
          patientId: id
        }
      })
    }

    return () => {
      setPetRecord(null)
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
                  <CDataTable
                    items={loading ? [] : (error ? [] : data?.rows || [])}
                    fields={fields}
                    striped
                    pagination
                    loading={loading}
                    onRowClick={(item) => showPetDetails(item)}
                    overTableSlot={
                      <p>All Pets</p>
                    }
                  />
                </CCardBody>
              </CCard>
            </CCol>
            {
              !petRecord ?
              <CCol>
                <p className="text-center py-5"><em>Please Select a pet to view complete Details !</em></p>
              </CCol> :
              <CCol md="8">
                <CCard>
                  <CCardBody>
                    <CFormGroup row className="justify-content-left pt-3">
                      <CLabel className="text-right" sm="3" col htmlFor="input-emirates-id">Pet Name</CLabel>
                      <CCol sm="7">
                        <CInput value={petRecord.name} readOnly  id="input-emirates-id" name="emiratesId" placeholder="Emirates ID" />
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row className="justify-content-left">
                      <CLabel className="text-right" sm="3" col htmlFor="input-emirates-id">Color</CLabel>
                      <CCol sm="7">
                        <CInput value={petRecord.color} readOnly  id="input-emirates-id" name="emiratesId" placeholder="Emirates ID" />
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row className="justify-content-left">
                      <CLabel className="text-right" sm="3" col htmlFor="input-emirates-id">Age</CLabel>
                      <CCol sm="7">
                        <CInput value={petRecord.age} readOnly  id="input-emirates-id" name="emiratesId" placeholder="Emirates ID" />
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row className="justify-content-left">
                      <CLabel className="text-right" sm="3" col htmlFor="input-emirates-id">Breed</CLabel>
                      <CCol sm="7">
                        <CInput value={petRecord.breed} readOnly  id="input-emirates-id" name="emiratesId" placeholder="Emirates ID" />
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row className="justify-content-left">
                      <CLabel className="text-right" sm="3" col htmlFor="input-emirates-id">Specie</CLabel>
                      <CCol sm="7">
                        <CInput value={petRecord.specie} readOnly  id="input-emirates-id" name="emiratesId" placeholder="Emirates ID" />
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row className="justify-content-left">
                      <CLabel className="text-right" sm="3" col htmlFor="input-emirates-id">Sex</CLabel>
                      <CCol sm="7">
                        <CInput value={petRecord.gender || 'none selected !'} readOnly  id="input-emirates-id" name="emiratesId" placeholder="Emirates ID" />
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row className="justify-content-left">
                      <CLabel className="text-right" sm="3" col htmlFor="input-emirates-id">Microchip ?</CLabel>
                      <CCol sm="7">
                        <CSwitch
                          className="pt-1"
                          color="primary"
                          name="active"
                          checked={petRecord.microchip}
                          readOnly
                          {
                            ...({
                              variant: 'opposite',
                              shape:'pill'
                            })
                          }
                        />
                      </CCol>
                    </CFormGroup>
                    {
                      petRecord.microchip && petRecord.microchipNumber &&
                      <CFormGroup row className="justify-content-left">
                        <CLabel className="text-right" sm="3" col htmlFor="input-emirates-id">Microchip number</CLabel>
                        <CCol sm="7">
                          <CInput value={petRecord.microchipNumber || ''} readOnly  id="input-microchipNumber" name="microchipNumber" placeholder="" />
                        </CCol>
                      </CFormGroup>
                    }
                  </CCardBody>
                </CCard>
              </CCol>
            }   
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
  )
}

export default PetRecords
