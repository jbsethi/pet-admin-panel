import { CButton, CCard, CCardBody, CCardHeader, CDataTable } from '@coreui/react'
import React from 'react'

import useAxios from 'axios-hooks'

import NewPrescription from './NewPrescription'
import { formatDate } from '../../utils/dateUtils'
import { AppContext } from '../../App.js'

const PetHistory = ({ match }) => {
  const { role } = React.useContext(AppContext)
  const [details, setDetails] = React.useState(null)
  const [show, setShow] = React.useState(false)
  const [items, setItems] = React.useState([])

  const [{ loading }, fetch] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/treatments/all/pets',
      method: 'POST',
    },
    {
      manual: true
    }
  )

  const refetch = () => {
    fetch({
      data: {
        petId: match.params.petId
      }
    }).then(resp => {
      setItems(resp?.data?.rows || [])
    })
  }

  const viewDetails = (item) => {
    setDetails(item)
    setShow(true)
  }

  const toggleModal = (status) => {
    setShow(status)
    if (!status) {
      setDetails(null)
    }
  }
  
  React.useEffect(() => {
    fetch({
      data: {
        petId: match.params.petId
      }
    }).then(resp => {
      setItems(resp?.data?.rows || [])
    })
  }, [fetch, match.params.petId])

  return (
    <CCard>
      <CCardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <div className="font-lg">Pet Previous History</div>
          {
            role === 'doctor' &&
            <CButton color="primary" onClick={() => setShow(true)}>
              Add Prescription for Pet
            </CButton>
          }
        </div>
      </CCardHeader>
      <CCardBody className="p-0">
        <CDataTable
          loading={loading}
          fields={['statement', 'description', 'createdAt']}
          items={items}
          onRowClick={(item) => viewDetails(item)}
          striped
          scopedSlots={{
            'createdAt':
              (item) => (
                <td>
                  {formatDate(item.createdAt)}
                </td>
              )
          }}
        ></CDataTable>
      </CCardBody>

      <NewPrescription  show={show} setShow={toggleModal} refetch={refetch} details={details}/>
    </CCard>
  )
}

export default PetHistory
