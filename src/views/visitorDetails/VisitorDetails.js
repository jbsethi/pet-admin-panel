import React from 'react'

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

const VisitorsDetail = React.lazy(() => import('./VisitorsDetail.js'));
const PetRecords = React.lazy(() => import('./PetRecords.js'));
const Orders = React.lazy(() => import('./Orders.js'));

const VisitorDetails = ({ match }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
    <CRow>
      <CCol xs="12" lg="12">
        <CCard>
          <CCardHeader className="p-0">
            <CNavbar expandable="sm" color="primary">
              <CCollapse show={isOpen} navbar>
                <CNavbarNav>
                  <CNavLink to={'/visitors/' + match.params.id + '/details'}>Visitor's Details</CNavLink>
                  <CNavLink to={'/visitors/' + match.params.id + '/pets'}>Pets</CNavLink>
                  <CNavLink to={'/visitors/' + match.params.id + '/orders'}>Orders</CNavLink>
                  <CNavLink to={'/visitors/' + match.params.id + '/doctors-prescription'}>Doctor's Prescriptions</CNavLink>
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
              <Route
                path={'/visitors/' + match.params.id + '/orders'}
                render={() => <Orders id={match.params.id} />}
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
