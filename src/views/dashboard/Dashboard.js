import React, { lazy } from 'react'

import useAxios from 'axios-hooks'

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))

const Dashboard = () => {
  const [{ data, loading, error }, fetch] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/stats/entities/count',
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
