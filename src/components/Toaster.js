import React from 'react'

import {
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'

const Toaster = ({ toasters }) => {
  return Object.keys(toasters).map((toasterKey) => (
    <CToaster
      position={toasterKey}
      key={'toaster' + toasterKey}
    >
      {
        toasters[toasterKey].map((toast, key)=>{
        return(
          <CToast
            key={'toast' + key}
            show={true}
            autohide={toast.autohide}
            fade={toast.fade}
            color="danger"
          >
            <CToastHeader closeButton={toast.closeButton}>
              { toast.title }
            </CToastHeader>
            <CToastBody>
              {toast.message}
            </CToastBody>
          </CToast>
        )
      })
    }
    </CToaster>
  ))
}

export default Toaster
