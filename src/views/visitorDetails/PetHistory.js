import { CButton, CCard, CCardBody, CCardHeader, CDataTable, CInput } from '@coreui/react'
import React, {useContext, useRef} from 'react'

import { useReactToPrint } from 'react-to-print';

import { formatDate } from '../../utils/dateUtils'

import useAxios from 'axios-hooks'

import NewPrescription from './NewPrescription'

import { AppContext } from '../../App.js'
import { PUBLIC_API, PUBLIC_PATH } from '../../config/index'

import Report from './Report'

import style from './report.module.css'
import historyStyle from './pethistory.module.css'

const PetHistory = ({ match }) => {
  const componentRef = useRef();
  const { role, addToast } = useContext(AppContext)

  const [details, setDetails] = React.useState(null)
  const [show, setShow] = React.useState(false)
  const [items, setItems] = React.useState([])

  const [historyData, setHistoryData] = React.useState(null)

  const [{ loading }, fetch] = useAxios(
    {
      url: PUBLIC_API + '/treatments/all/pets',
      method: 'POST',
    },
    {
      manual: true
    }
  )

  const viewDetails = (item) => {
    setDetails(item)
    setShow(true)
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const toggleModal = (status) => {
    setShow(status)
    if (!status) {
      setDetails(null)
    }
  }

  const submitFileUpload = (e, id) => {
    const data = new FormData()
    data.append('file', e.target.files[0])

    fetch({
      method: 'POST',
      url: PUBLIC_API + 'uploads/file',
      data,
    }).then(response => {
      fetch({
        method: 'PATCH',
        url: PUBLIC_API + 'treatments/' + id + '/image',
        data: {
          image: response.data.fileName
        }
      })
      .then(() => {
        setItems((oldItems) => {
          return oldItems.map(item => {
            if (item.id == id) {
              return {
                ...item,
                image: response.data.fileName
              }
            }

            return item
          })
        })
      }).catch(() => {
        throw new Error('Something went wrong')
      })
    }).catch(err => {
      alert('Something went wrong upload file please try again!')
    })
  }

  const setPrintRecord = (rows) => {
    if (rows.length > 0) {
      const petRecord = rows[0].Pet
      const patientRecord = rows[0].Order.Patient

      const historyPrintableRecord = {
        petRecord,
        patientRecord,
        data: rows
      }

      setHistoryData(historyPrintableRecord)
    } else {
      setHistoryData(null)
    }
  }

  const init = React.useCallback(() => {
    fetch({
      data: {
        petId: match.params.petId
      }
    }).then(resp => {
      setItems(resp?.data?.rows || [])

      setPrintRecord(resp?.data?.rows || [])
    })
  }, [fetch, match.params.petId])

  React.useEffect(() => {
    init()
  }, [fetch, match.params.petId, init])

  return (
    <CCard>
      <CCardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <div className="font-lg">Pet Previous History</div>
          {
            role !== 'doctor' && historyData &&
            <div>
              <CButton color="primary" onClick={handlePrint}>Print History</CButton>
            </div>
          }
        </div>
      </CCardHeader>
      <CCardBody className="p-0">
        <CDataTable
          loading={loading}
          fields={['statement', 'description', 'doctor', 'createdAt', { key: 'action', label: '' }]}
          items={items}
          onRowClick={(item) => viewDetails(item)}
          striped
          scopedSlots = {{
            'doctor':
              (item) => (
                <td>
                  { item?.Order?.AssignTo?.name || 'N/A' }
                </td>
              ),
            'createdAt':
              (item) => (
                <td>
                  {formatDate(item.createdAt)}
                </td>
              ),
            'action': (item) => (<td>
              {
                !item.image ? (
                  <div onClick={e => e.stopPropagation()} className={historyStyle["upload-btn-wrapper"]}>
                    <CButton size="sm" className={historyStyle["btn"]}>Upload</CButton>
                    <input onChange={(e) => submitFileUpload(e, item.id)} type="file" name="myfile" />
                  </div>
                ) : (
                  <a href={PUBLIC_PATH + item.image} download="download">Download</a>
                )
              }
            </td>)
          }}
        ></CDataTable>
      </CCardBody>

      <NewPrescription  show={show} setShow={toggleModal} details={details} refetch={init}/>

      <div className={style.printable} ref={componentRef}>
        <Report data={historyData} />
      </div>
    </CCard>
  )
}

export default PetHistory
