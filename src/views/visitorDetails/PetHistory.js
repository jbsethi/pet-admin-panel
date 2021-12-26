import { CButton, CCard, CCardBody, CCardHeader, CDataTable } from '@coreui/react'
import React, {useContext, useRef} from 'react'

import { useReactToPrint } from 'react-to-print';

import { formatDate } from '../../utils/dateUtils'

import useAxios from 'axios-hooks'

import NewPrescription from './NewPrescription'

import { AppContext } from '../../App.js'
import { PUBLIC_API } from '../../config/index'

import Report from './Report'

import style from './report.module.css'

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

  React.useEffect(() => {
    fetch({
      data: {
        petId: match.params.petId
      }
    }).then(resp => {
      setItems(resp?.data?.rows || [])

      setPrintRecord(resp?.data?.rows || [])
    })
  }, [fetch, match.params.petId])

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
          fields={['statement', 'description', 'doctor', 'createdAt']}
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
              )
          }}
        ></CDataTable>
      </CCardBody>

      <NewPrescription  show={show} setShow={toggleModal} details={details}/>

      <div className={style.printable} ref={componentRef}>
        <Report data={historyData} />
      </div>
    </CCard>
  )
}

export default PetHistory
