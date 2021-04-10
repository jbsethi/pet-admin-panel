import React from 'react'

import useAxios from 'axios-hooks'

import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CProgress
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppContext } from '../App.js'

const TheHeaderDropdownNotif = () => {
  const { addToast } = React.useContext(AppContext)
  const [notifications, setNotifications] = React.useState([])
  const [, fetch] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/notifications/all/records',
      method: 'GET',
    },
    {
      manual: true
    }
  )

  React.useEffect(() => {
    const id = setInterval(() => {
      const date = new Date()
      const dateFormat = `${date.getFullYear()}-${(+date.getMonth() + 1)}-${date.getDate()}`
      fetch({
        params: {
          date: dateFormat
        }
      }).then(resp => {
        setNotifications(resp?.data || [])
      }).catch(err => {
        addToast({
          message: err?.response?.data?.message || 'Error Occured ! Try again later'
        })
      })
    }, 10000);


    return () => {
      clearInterval(id);
    };
  }, []);


  return (
    <CDropdown
      inNav
      className="c-header-nav-item mx-2"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <CIcon name="cil-bell"/>
        <CBadge shape="pill" color="danger">{notifications.length}</CBadge>
      </CDropdownToggle>
      <CDropdownMenu  placement="bottom-end" className="pt-0">
        <CDropdownItem
          header
          tag="div"
          className="text-center"
          color="light"
        >
          <strong>You have {notifications.length} notifications</strong>
        </CDropdownItem>
        {
          notifications.map(n => <CDropdownItem>New user registered</CDropdownItem>)
        }
        
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdownNotif