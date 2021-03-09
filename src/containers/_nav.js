import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Visitors',
    to: '/visitors',
    icon: 'cil-address-book',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Pet Types',
    to: '/pet-types',
    icon: 'cil-address-book',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Users',
    to: '/users',
    icon: 'cil-address-book',
  }
]

export default _nav
