import { CCard, CCardBody, CCardHeader, CDataTable } from '@coreui/react'
import React from 'react'

import useAxios from 'axios-hooks'

import NewPrescription from './NewPrescription'

const PetHistory = ({ match }) => {
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
        </div>
      </CCardHeader>
      <CCardBody className="p-0">
        <CDataTable
          loading={loading}
          fields={['statement', 'description', 'createdAt']}
          items={items}
          onRowClick={(item) => viewDetails(item)}
          striped
        ></CDataTable>
      </CCardBody>

      <NewPrescription  show={show} setShow={toggleModal} details={details}/>
    </CCard>
  )
}

export default PetHistory
