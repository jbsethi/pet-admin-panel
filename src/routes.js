import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Visitors = React.lazy(() => import('./views/visitors/Visitors'));
const VisitorAdd = React.lazy(() => import('./views/addVisitor/AddVisitor'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/visitors', exact: true, name: 'Visitors', component: Visitors },
  { path: '/visitors/add', exact: true, name: 'Add Visitors', component: VisitorAdd }
];

export default routes;
