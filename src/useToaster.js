import { useState } from 'react';

export default function useToaster() {
  const [toasts, setToasts] = useState([
    { position: 'top-right', autohide: 3000, title: 'Error', message: 'Error occured' }
  ])

  const addToast = (toast) => {
    setToasts([
      ...toasts,
      {
        position: toast.position || 'top-right',
        autohide: toast.autohide || 5000,
        closeButton: true,
        fade: true,
        title: toast.title || 'Message',
        message: toast.message || 'Message'
      }
    ])
  }


  const toasters = (()=>{
    return toasts.reduce((toasters, toast) => {
      toasters[toast.position] = toasters[toast.position] || []
      toasters[toast.position].push(toast)
      return toasters
    }, {})
  })()

  return {
    toasts: toasters,
    addToast
  }
}