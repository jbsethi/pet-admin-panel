import React from 'react'

import useAxios from 'axios-hooks'

import { useHistory } from 'react-router-dom'

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
  const history = useHistory()
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


  const clickNotification = (n) => {

    fetch({
      url: 'https://app.aloropivetcenter.com/api/notifications/' + n.id
    })

    history.push({
      pathname: `/visitors/${n.patientId}/details`
    })
  }

  React.useEffect(() => {
    loadNotifications()
    const id = setInterval(() => {
      loadNotifications()
    }, 10000);


    return () => {
      clearInterval(id);
    };
  }, []);

  const loadNotifications = () => {
    const date = new Date()
    const dateFormat = `${date.getFullYear()}-${(+date.getMonth() + 1)}-${date.getDate()}`
    // const dateFormat = `2021-04-13`
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
  }


  return (
    <CDropdown
      inNav
      className="c-header-nav-item mx-2"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <CIcon name="cil-bell"/>
        {
          notifications.length > 0 &&
          <CBadge shape="pill" color="danger">{(notifications.filter(n => n.isRead !== true)).length}</CBadge>
        }
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
          notifications.length == 0 && <p className="text-center m-0 py-2"><em>No notifications !</em></p>
        }
        {
          notifications.map((n, i) => <CDropdownItem key={i} onClick={() => clickNotification(n)}>{n.Patient.name} has a Follow up</CDropdownItem>)
        }
        
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdownNotif