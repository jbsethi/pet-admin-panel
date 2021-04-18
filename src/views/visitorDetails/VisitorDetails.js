import React, {useContext} from 'react'

import {
  CCard,
  CCol,
  CRow,
  CNavbar,
  CCollapse,
  CNavbarNav,
  CNavLink,
  CCardHeader,
  CCardBody
} from '@coreui/react'

import { Switch, Route } from 'react-router-dom'

import { AppContext } from '../../App.js'

const VisitorsDetail = React.lazy(() => import('./VisitorsDetail.js'));
const PetRecords = React.lazy(() => import('./PetRecords.js'));
const Orders = React.lazy(() => import('./Orders.js'));
const Treatment = React.lazy(() => import('./Treatments.js'));

const VisitorDetails = ({ match }) => {
  const { role } = useContext(AppContext)
  return (
    <>
    <CRow>
      <CCol xs="12" lg="12">
        <CCard>
          <CCardHeader className="p-0">
            <CNavbar expandable="sm" color="primary">
              <CCollapse show={true} navbar>
                <CNavbarNav>
                  <CNavLink to={'/visitors/' + match.params.id + '/details'}>Visitor's Details</CNavLink>
                  <CNavLink to={'/visitors/' + match.params.id + '/pets'}>Pets</CNavLink>
                  {
                    role !== 'doctor' &&
                    <CNavLink to={'/visitors/' + match.params.id + '/orders'}>Orders</CNavLink>
                  }
                  <CNavLink to={'/visitors/' + match.params.id + '/treatments'}>Doctor's Prescriptions</CNavLink>
                </CNavbarNav>
              </CCollapse>
            </CNavbar>
          </CCardHeader>
          <CCardBody>
          <React.Suspense fallback={<p>Loading Please Wait ...</p>}>
            <Switch>
              <Route
                path={'/visitors/' + match.params.id + '/details'}
                exact
                render={() => <VisitorsDetail id={match.params.id} />}
              />
              <Route
                path={'/visitors/' + match.params.id + '/pets'}
                render={() => <PetRecords id={match.params.id} />}
              />
              {
                role !== 'doctor' &&
                <Route
                  path={'/visitors/' + match.params.id + '/orders'}
                  render={() => <Orders id={match.params.id} />}
                />
              }
              <Route
                path={'/visitors/' + match.params.id + '/treatments'}
                render={() => <Treatment id={match.params.id} match={{ params: match.params }}/>}
              />
              </Switch>
            </React.Suspense>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    </>
  )
}

export default VisitorDetails
