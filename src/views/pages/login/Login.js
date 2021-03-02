import React, { useState, useEffect, useContext } from 'react'
import useAxios from 'axios-hooks'
import { AppContext } from '../../../App'

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const Login = () => {
  const { setToken } = useContext(AppContext)

  const [
    { data, loading, error },
    executePost
  ] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/authentication/login',
      method: 'POST'
    },
    { manual: true }
  )

  const [creds, setCreds] = useState({
    username: '',
    password: ''
  })

  const updateCred = (e) => {
    setCreds((oldCreds) => {
      return {
        ...oldCreds,
        [e.target.name]: e.target.value
      }
    })
  }

  const loginUser = (e) => {
    if (!loading) {
      executePost({
        data: {
          ...creds
        }
      })
    }
  }

  useEffect(() => {
    if (data && data.token) {
      console.log(data.token)
      setToken(data.token)
    }
  }, [data, setToken])

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput name="username" type="text" placeholder="Username" autoComplete="username" value={creds.username} onChange={updateCred} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput name="password" type="password" placeholder="Password" autoComplete="current-password"  value={creds.password} onChange={updateCred} />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton onClick={loginUser} color="primary" className="px-4">
                          { loading ? 'Loading' : 'Login' }
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign In</h2>
                    <p>Sign in to access the admin panel.</p>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
