import React, { useState, useEffect, useContext } from 'react'
import useAxios from 'axios-hooks'
import { AppContext } from '../../../App'

import LogoImage from '../../../assets/logo/logo.jpg'

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
  CRow,
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const Login = () => {
  const [ errMessage, setErrorMessage ] = useState('')
  const { setToken, setRole } = useContext(AppContext)

  const [
    { data, loading },
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
      }).catch(err => {
        setErrorMessage(err.response?.data?.message || 'Error occured try again later !')
      })
    }
  }

  useEffect(() => {
    if (data && data.token) {
      const temp = data.token.split('.')[1]
      const tokenData = JSON.parse(atob(temp))

      localStorage.setItem('tokenExpiry', tokenData.exp)

      setRole(tokenData.role.name)
      setToken(data.token)
    }
  }, [data, setRole, setToken])

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
                    <p className="text-muted">Sign In to your Aloropi account</p>
                    {
                      errMessage &&
                      <CAlert color="danger">{errMessage}</CAlert>
                    }
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
              <CCard className="text-white bg-primary d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <img src={LogoImage} alt="Vet" style={{ width: '100%' }} />
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
