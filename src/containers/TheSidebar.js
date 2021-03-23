import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'

// sidebar nav config
import navigation from './_nav'

import LogoImage from '../assets/logo/logo.png'

import { AppContext } from '../App.js'

const TheSidebar = () => {
  const [navigations, setNavigations] = React.useState([])
  const { role } = React.useContext(AppContext)

  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)


  React.useEffect(() => {
    setNavigations(navigation.filter(nav => nav.roles.includes(role)))
  }, [role])

  return (
    <CSidebar
      show={show}
      colorScheme="light"
      onShowChange={(val) => dispatch({type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <div className="c-sidebar-brand-full">
          <div className="d-flex">
            <div>
              <img src={LogoImage} alt="logo" height="50"/>
            </div>
            <div className="ml-2">
              <p className="mb-0 text-primary font-bold font-xl">Aloropi</p>
              <p className="mb-0 font-sm">Veterinary Center</p>
            </div>
          </div>
        </div>
        <div className="c-sidebar-brand-minimized">
          <div>
            <img src={LogoImage} alt="logo" height="50"/>
          </div>
        </div>
      </CSidebarBrand>
      <CSidebarNav>
        {
          navigations.length > 0 &&
          <CCreateElement
            items={navigations}
            components={{
              CSidebarNavDivider,
              CSidebarNavDropdown,
              CSidebarNavItem,
              CSidebarNavTitle
            }}
          />
        }
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none"/>
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
