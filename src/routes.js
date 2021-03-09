import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Visitors = React.lazy(() => import('./views/visitors/Visitors'));
const VisitorAdd = React.lazy(() => import('./views/addVisitor/AddVisitor'));
const PetTypes = React.lazy(() => import('./views/petTypes/PetTypes'));
const Users = React.lazy(() => import('./views/users/Users'));
const User = React.lazy(() => import('./views/users/User'));
const AddUser = React.lazy(() => import('./views/users/AddUser'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/visitors', exact: true, name: 'Visitors', component: Visitors },
  { path: '/visitors/add', exact: true, name: 'Add Visitors', component: VisitorAdd },
  { path: '/pet-types', exact: true, name: 'Pet Types', component: PetTypes },
  { path: '/users', exact: true, name: 'Users', component: Users },
  { path: '/users/add', exact: true, name: 'Add New User', component: AddUser },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
  { path: '/users/:id/edit', exact: true, name: 'Edit User', component: AddUser },
];

export default routes;
