import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    roles: ['superman', 'administrator', 'receptionist']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Visitors',
    to: '/visitors',
    icon: 'cil-address-book',
    roles: ['superman', 'administrator', 'receptionist', 'doctor']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Check up',
    to: '/check-up',
    icon: 'cil-address-book',
    roles: ['superman', 'administrator', 'receptionist', 'doctor']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Pet Types',
    to: '/pet-types',
    icon: 'cil-address-book',
    roles: ['superman', 'administrator', 'receptionist']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Services',
    to: '/services',
    icon: 'cil-address-book',
    roles: ['superman', 'administrator', 'receptionist']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Items',
    to: '/items',
    icon: 'cil-address-book',
    roles: ['superman', 'administrator', 'receptionist']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Packages',
    to: '/packages',
    icon: 'cil-address-book',
    roles: ['superman', 'administrator', 'receptionist']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Users',
    to: '/users',
    icon: 'cil-address-book',
    roles: ['superman', 'administrator']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Roles',
    to: '/roles',
    icon: 'cil-address-book',
    roles: ['superman', 'administrator']
  }
]

export default _nav
