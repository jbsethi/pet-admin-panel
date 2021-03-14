import React from 'react'
import useAxios from 'axios-hooks'

import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CFormGroup,
  CCol,
  CLabel,
  CInput,
  CRow,
} from '@coreui/react'

const ForgotPassword = ({ id, show, setShow }) => {
  const [userData, setUserData] = React.useState({
    password: '',
    confirmPassword: ''
  })

  const [
    { data, loading },
    executePost
  ] = useAxios(
    {
      url: `https://app.aloropivetcenter.com/api/users/password-reset/${id}`,
      method: 'POST'
    },
    { manual: true }
  )

  const toggle = () => {
    setShow(!show)
  }

  const confirmClose = React.useCallback(() => {
    setShow(false)
    setUserData({
      password: '',
      confirmPassword: ''
    })
  }, [setShow])

  const handleChange = (e) => {
    setUserData((oldState) => {
      return {
        ...oldState,
        [e.target.name]: e.target.value
      }
    })
  }

  const storeUserPassword = () => {
    if (!loading) {
      executePost({
        data: {
          ...userData
        }
      })
    }
  }

  React.useEffect(() => {
    if (data) {
      confirmClose()
    }
  }, [data, confirmClose])

  return (
    <>
      <CModal
        show={show}
        onClose={toggle}
      >
        <CModalHeader closeButton>Change Password</CModalHeader>
        <CModalBody>
          <CRow>
            <CCol className="px-5 pt-4">
              <CFormGroup row className="justify-content-center">
                <CLabel className="text-right" sm="5" col htmlFor="input-password">Password</CLabel>
                <CCol sm="7">
                  <CInput value={userData.password} onChange={handleChange} id="input-password" name="password" placeholder="Password" type="password" />
                </CCol>
              </CFormGroup>
              <CFormGroup row className="justify-content-center">
                <CLabel className="text-right" sm="5" col htmlFor="input-confirm-password">Confirm Password</CLabel>
                <CCol sm="7">
                  <CInput value={userData.confirmPassword} onChange={handleChange} id="input-confirm-password" name="confirmPassword" placeholder="Password" type="password" />
                </CCol>
              </CFormGroup>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={toggle}
          >
            Cancel
          </CButton>
          <CButton onClick={storeUserPassword} className="ml-1" color="primary">{ loading ? 'Loading' : 'Confirm' }</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default ForgotPassword
