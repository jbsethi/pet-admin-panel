import {  CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import React from 'react'
import { Route, useHistory } from 'react-router-dom'
import PetHistory from './PetHistory'
import PetTabs from './PetTabs'

import useAxios from 'axios-hooks'

import { AppContext } from '../../App.js'

const Treatment = ({ match }) => {
  const { addToast } = React.useContext(AppContext)
  const history = useHistory()
  const [items, setItems] = React.useState([])
  const [{ loading }, fetch] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/pets/all/patients',
      method: 'POST',
    },
    {
      manual: true
    }
  )

  React.useEffect(() => {
    fetch({
      data: {
        patientId: match.params.id
      }
    }).then((resp) => {
      setItems(resp?.data?.rows.map(item => {
        return {
          id: item.id,
          patientId: match.params.id,
          name: item.name,
          createdAt: item.createdAt
        }
      }))

      if (resp?.data?.rows?.length  > 0)
        history.replace(`/visitors/${match.params.id}/treatments/${resp?.data?.rows[0].id}`)
    }).catch(err => {
      addToast({
        message: err?.response?.data?.message || 'Error occured try again later !'
      })
    })

  }, [fetch, match.params.id, history])


  return (
    <>
      <CRow>
        <CCol md="4">
          <CCard>
            <CCardHeader>
              <p className="font-lg m-0">Pets</p>
            </CCardHeader>
            <CCardBody className="p-0">
              {
                loading ?
                <p className="pt-3 text-center">Loading ...</p> :
                <PetTabs pets={items} ></PetTabs>
              }
            </CCardBody>
          </CCard>
        </CCol>
        <CCol>
          <Route path="/visitors/:id/treatments" exact render={() => (
            <p className="p-5 text-center">Please select Pet to view details.</p>
          )} />
          <Route path="/visitors/:id/treatments/:petId" component={PetHistory} />
        </CCol>
      </CRow>
    </>
  )
}

export default Treatment
