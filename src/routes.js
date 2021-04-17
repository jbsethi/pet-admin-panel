import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Visitors = React.lazy(() => import('./views/visitors/Visitors'));
const VisitorAdd = React.lazy(() => import('./views/addVisitor/AddVisitor'));
const VisitorDetails = React.lazy(() => import('./views/visitorDetails/VisitorDetails'));
const PetTypes = React.lazy(() => import('./views/petTypes/PetTypes'));
const Services = React.lazy(() => import('./views/services/Services'));
const Items = React.lazy(() => import('./views/items/Items'));
const Packages = React.lazy(() => import('./views/packages/Packages'));
const Users = React.lazy(() => import('./views/users/Users'));
const Roles = React.lazy(() => import('./views/roles/Roles'));
const User = React.lazy(() => import('./views/users/User'));
const AddUser = React.lazy(() => import('./views/users/AddUser'));
const Treatment = React.lazy(() => import('./views/treatment/Treatment'));
const Treatments = React.lazy(() => import('./views/treatment/Treatments'));

const routes = [
  { path: '/', exact: true, name: 'Home', roles: ['superman', 'admin', 'receptionist', 'doctor'] },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, roles: ['superman', 'admin', 'receptionist'] },
  { path: '/visitors', exact: true, name: 'Visitors', component: Visitors, roles: ['superman', 'admin', 'receptionist', 'doctor'] },
  { path: '/visitors/add', exact: true, name: 'Add Visitors', component: VisitorAdd, roles: ['superman', 'admin', 'receptionist'] },
  { path: '/visitors/:id/:slug', exact: true, name: 'Visitor\'s Details', component: VisitorDetails, roles: ['superman', 'admin', 'receptionist', 'doctor'] },
  { path: '/visitors/:id/:slug/:petId', exact: true, name: 'Visitor\'s Details', component: VisitorDetails, roles: ['superman', 'admin', 'receptionist', 'doctor'] },
  { path: '/check-up', exact: true, name: 'Check up', component: Treatments, roles: ['superman', 'admin', 'receptionist', 'doctor'] },
  { path: '/check-up/:id/:slug', exact: true, name: 'Pet Treatment', component: Treatment, roles: ['superman', 'admin', 'receptionist', 'doctor'] },
  { path: '/check-up/:id/:slug/:petId', exact: true, name: 'Details', component: Treatment, roles: ['superman', 'admin', 'receptionist', 'doctor'] },
  { path: '/pet-types', exact: true, name: 'Pet Types', component: PetTypes, roles: ['superman', 'admin', 'receptionist'] },
  { path: '/services', exact: true, name: 'Pet Services', component: Services, roles: ['superman', 'admin', 'receptionist']  },
  { path: '/items', exact: true, name: 'Items', component: Items, roles: ['superman', 'admin', 'receptionist']  },
  { path: '/packages', exact: true, name: 'Packages', component: Packages, roles: ['superman', 'admin', 'receptionist']  },
  { path: '/roles', exact: true, name: 'Roles', component: Roles, roles: ['superman', 'admin'] },
  { path: '/users', exact: true, name: 'Users', component: Users, roles: ['superman', 'admin'] },
  { path: '/users/add', exact: true, name: 'Add New User', component: AddUser, roles: ['superman', 'admin'] },
  { path: '/users/:id', exact: true, name: 'User Details', component: User, roles: ['superman', 'admin'] },
  { path: '/users/:id/edit', exact: true, name: 'Edit User', component: AddUser, roles: ['superman', 'admin'] },
];

export default routes;
