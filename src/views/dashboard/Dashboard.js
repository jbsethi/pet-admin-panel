import React, { lazy } from 'react'

import useAxios from 'axios-hooks'

import { PUBLIC_API } from '../../config/index'


const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))

const Dashboard = () => {
  const [{ data, loading, error }, fetch] = useAxios(
    {
      url: PUBLIC_API + '/stats/entities/count',
      method: 'GET'
    },
    {
      manual: true
    }
  )

  React.useEffect(() => {
    fetch()
  }, [])


  return (
    <>
      <WidgetsDropdown data={data} />
    </>
  )
}

export default Dashboard
