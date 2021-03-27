import { CCard, CCardBody } from '@coreui/react'
import React from 'react'

import { NavLink } from 'react-router-dom'

import { withRouter } from 'react-router-dom'

const PetTab = ({ match, pet }) => {
  return (
    <NavLink to={{
      pathname: `/check-up/${match.params.id}/${match.params.slug}/${pet.id}`
    }}>
      <CCard className="m-0">
        <CCardBody className="p-3">
          <div className="d-flex justify-content-between align-items-center">
            <p className="m-0">{pet.name}</p>
            <p className="m-0">{pet.createdAt}</p>
          </div>
        </CCardBody>
      </CCard>
    </NavLink>
  )
}

export default withRouter(PetTab)
