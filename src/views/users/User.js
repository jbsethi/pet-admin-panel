import React from 'react'
import { useHistory } from 'react-router-dom'
import useAxios from 'axios-hooks'

import { PUBLIC_API, PUBLIC_PATH } from '../../config/index'

import ForgotPassword from './ForgotPassword'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
  CSelect,
  CSwitch,
  CMedia,
  CCardFooter,
  CButton
} from '@coreui/react'

const defaultImageUrl = "https://www.kindpng.com/picc/m/72-723761_student-png-sammilani-mahavidyalaya-undergraduate-and-dummy-user.png"

const User = ({ match }) => {
  const history = useHistory()
  const [show, setShow] = React.useState(false)

  const [
    { data, loading, error }
  ] = useAxios({
    url: `${PUBLIC_API}/users/${match.params.id}`,
    method: 'GET'
  })
  
  const [userRecord, setUserRecord] = React.useState({
    emiratesId: '',
    role: 1,
    name: '',
    email: '',
    contact: '',
    username: '',
    password: '',
    confirm_password: '',
    image: '',
    active: true
  })

  React.useEffect(() => {
    if (data) {
      setUserRecord({...data})
    }
  }, [data])


  React.useEffect(() => {
    if (error) {
      history.push('/users')
    }
  }, [error, history])

  return (
    <>
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            Users Details
          </CCardHeader>
          <CCardBody>
            {
              loading ?
              <div className="p-5 text-center">Loading Please Wait</div> :
              <CForm action="" method="post" className="form-horizontal">
                <CRow>
                  <CCol lg="7">
                    <CFormGroup row className="justify-content-center">
                      <CLabel className="text-right" sm="3" col htmlFor="input-emirates-id">Emirates ID</CLabel>
                      <CCol sm="6">
                        <CInput value={userRecord.emiratesId} readOnly  id="input-emirates-id" name="emiratesId" placeholder="Emirates ID" />
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row className="justify-content-center">
                      <CLabel className="text-right" sm="3" col htmlFor="input-role">Roles</CLabel>
                      <CCol sm="6">
                        <CSelect value={userRecord.role} disabled custom name="role" id="input-role">
                          <option value="1">Administrator</option>
                          <option value="2">Receiptionist</option>
                          <option value="3">Doctor</option>
                        </CSelect>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row className="justify-content-center">
                      <CLabel className="text-right" sm="3" col htmlFor="input-name">Name</CLabel>
                      <CCol sm="6">
                        <CInput value={userRecord.name} readOnly id="input-name" name="name" placeholder="Name" />
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row className="justify-content-center">
                      <CLabel className="text-right" sm="3" col htmlFor="input-email">Email</CLabel>
                      <CCol sm="6">
                        <CInput value={userRecord.email} readOnly id="input-email" name="email" placeholder="Email" />
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row className="justify-content-center">
                      <CLabel className="text-right" sm="3" col htmlFor="input-contact">Phone No</CLabel>
                      <CCol sm="6">
                        <CInput value={userRecord.contact} readOnly id="input-contact" name="contact" placeholder="Phone no" />
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row className="justify-content-center">
                      <CLabel className="text-right" sm="3" col htmlFor="input-username">Username</CLabel>
                      <CCol sm="6">
                        <CInput value={userRecord.username} readOnly id="input-username" name="username" placeholder="Username" />
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row className="justify-content-center">
                      <CLabel className="text-right" sm="3" col htmlFor="input-active">Active</CLabel>
                      <CCol sm="6">
                        <CSwitch
                          className="pt-1"
                          color="primary"
                          name="active"
                          checked={userRecord.active}
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
                  </CCol>
                  <CCol lg="4">
                    <CMedia className="flex-column">
                      <img src={userRecord.image ? `${PUBLIC_PATH}${userRecord.image}` : defaultImageUrl} alt="preview" width="100%"/>
                    </CMedia>
                  </CCol>
                </CRow>
              </CForm>
            }
          </CCardBody>
          {
            !loading &&
            <CCardFooter >
              <section className="text-right w-50 ml-auto">
                <CButton onClick={() => setShow(true)} color="danger" className="mr-1 w-25">
                  Change Password
                </CButton>
                <CButton onClick={() => history.push(`/users/${userRecord.id}/edit`)} color="primary" className="w-25">
                  Edit Details
                </CButton>
              </section>
            </CCardFooter>
          }
        </CCard>
      </CCol>
    </CRow>
    <ForgotPassword show={show} setShow={setShow} id={userRecord.id}/>
    </>
  )
}

export default User
