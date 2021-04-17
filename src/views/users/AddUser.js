import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import useAxios from 'axios-hooks'

import { PUBLIC_API } from '../../config/index'

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
  CMediaBody,
  CCardFooter,
  CButton
} from '@coreui/react'

import { AppContext } from '../../App.js'

const defaultImageUrl = "https://www.kindpng.com/picc/m/72-723761_student-png-sammilani-mahavidyalaya-undergraduate-and-dummy-user.png"

const formDataObj = (obj) => {
  const formData = new FormData()
  Object.keys(obj).forEach(key => formData.append(key, obj[key]))
  return formData
}

const AddUser = ({ match }) => {
  const { addToast } = useContext(AppContext)
  const history = useHistory()

  const [
    { data, loading },
    executePost
  ] = useAxios(
    {
      url: `https://app.aloropivetcenter.com/api/users${match?.params?.id ? '/' + match?.params?.id : ''}`,
      method: match?.params?.id ? 'PUT' : 'POST'
    },
    { manual: true }
  )

  const [
    { data: userData },
    getUserDetails
  ] = useAxios({
    url: `${PUBLIC_API}/users/${match.params.id}`,
    method: 'GET'
  },
  {
    manual: true
  })


  
  const [previewImg, setPreviewImg] = React.useState(null)
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

  const handleChange = (e) => {
    setUserRecord(oldState => {
      return {
        ...oldState,
        [e.target.name]: e.target.name === 'active'? e.target.checked : e.target.value
      }
    })
  }

  const handleImageChange = (e) => {
    let reader = new FileReader()
    let file = e.target.files[0]

    reader.onloadend = () => {
      setUserRecord(oldState => {
        return {
          ...oldState,
          image: file
        }
      })

      setPreviewImg(reader.result)
    }

    reader.readAsDataURL(file)
  }

  const storeUserInfo = () => {
    if (!loading) {
      const storeInfo = {...userRecord}
      if (match.params.id) {
        delete storeInfo.password
        delete storeInfo.confirm_password
      }
      const formData = formDataObj(storeInfo)
      
      executePost({
        data: formData
      }).catch(err => {
        addToast({
          message: err.response.data.message
        })
      })
    }
  }

  const resetForm = () => {
    setUserRecord(() => {
      return {
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
      }
    })

    setPreviewImg(null)
  }


  React.useEffect(() => {
    if (data) {
      history.push('/users')
    }
  }, [data, history])

  React.useEffect(() => {
    if (userData) {
      setUserRecord({
        emiratesId: userData.emiratesId,
        role: userData.role,
        name: userData.name,
        email: userData.email,
        contact: userData.contact,
        username: userData.username,
        password: '',
        confirm_password: '',
        image: userData.image,
        active: userData.active,
      })
    } else {
      if (match?.params?.id) {
        getUserDetails().catch(err => {
          addToast({
            message: err.response.data.message
          })
        })
      }
    }
  }, [userData, setUserRecord, getUserDetails, match])

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            Add Users
          </CCardHeader>
          <CCardBody>
            <CForm action="" method="post" className="form-horizontal">
              <CRow>
                <CCol lg="7">
                  <CFormGroup row className="justify-content-center">
                    <CLabel className="text-right" sm="3" col htmlFor="input-emirates-id">Emirates ID</CLabel>
                    <CCol sm="6">
                      <CInput value={userRecord.emiratesId} onChange={handleChange} id="input-emirates-id" name="emiratesId" placeholder="Emirates ID" />
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row className="justify-content-center">
                    <CLabel className="text-right" sm="3" col htmlFor="input-role">Roles</CLabel>
                    <CCol sm="6">
                      <CSelect value={userRecord.role} onChange={handleChange} custom name="role" id="input-role">
                        <option value="2">Administrator</option>
                        <option value="4">Receiptionist</option>
                        <option value="3">Doctor</option>
                      </CSelect>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row className="justify-content-center">
                    <CLabel className="text-right" sm="3" col htmlFor="input-name">Name</CLabel>
                    <CCol sm="6">
                      <CInput value={userRecord.name} onChange={handleChange} id="input-name" name="name" placeholder="Name" />
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row className="justify-content-center">
                    <CLabel className="text-right" sm="3" col htmlFor="input-email">Email</CLabel>
                    <CCol sm="6">
                      <CInput value={userRecord.email} onChange={handleChange} id="input-email" name="email" placeholder="Email" />
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row className="justify-content-center">
                    <CLabel className="text-right" sm="3" col htmlFor="input-contact">Phone No</CLabel>
                    <CCol sm="6">
                      <CInput value={userRecord.contact} onChange={handleChange} id="input-contact" name="contact" placeholder="Phone no" />
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row className="justify-content-center">
                    <CLabel className="text-right" sm="3" col htmlFor="input-username">Username</CLabel>
                    <CCol sm="6">
                      <CInput value={userRecord.username} onChange={handleChange} id="input-username" name="username" placeholder="Username" />
                    </CCol>
                  </CFormGroup>
                  {
                    !match?.params?.id &&
                    <>
                      <CFormGroup row className="justify-content-center">
                        <CLabel className="text-right" sm="3" col htmlFor="input-password">Password</CLabel>
                        <CCol sm="6">
                          <CInput value={userRecord.password} onChange={handleChange} id="input-password" name="password" placeholder="Password" type="password" />
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row className="justify-content-center">
                        <CLabel className="text-right" sm="3" col htmlFor="input-confirm-password">Confirm Password</CLabel>
                        <CCol sm="6">
                          <CInput value={userRecord.confirm_password} onChange={handleChange} id="input-confirm-password" name="confirm_password" placeholder="Password" type="password" />
                        </CCol>
                      </CFormGroup>
                    </> 
                  }
                  <CFormGroup row className="justify-content-center">
                    <CLabel className="text-right" sm="3" col htmlFor="input-active">Active</CLabel>
                    <CCol sm="6">
                      <CSwitch
                        className="pt-1"
                        color="primary"
                        name="active"
                        checked={userRecord.active}
                        onChange={handleChange}
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
                    <img src={previewImg || defaultImageUrl} alt="preview" width="100%"/>
                    <CMediaBody className="w-100 mt-4">
                      <CFormGroup row>
                        <CCol sm="12">
                          <CInput onChange={handleImageChange} id="input-image" name="image" type="file" />
                        </CCol>
                      </CFormGroup>

                    </CMediaBody>
                  </CMedia>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <section className="text-right w-50 ml-auto">
              <CButton onClick={resetForm} color="danger" className="mr-1 w-25">
                Clear
              </CButton>
              <CButton onClick={storeUserInfo} color="primary" className="w-25">
                {loading ? 'Loading' : 'Submit'}
              </CButton>
            </section>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddUser
