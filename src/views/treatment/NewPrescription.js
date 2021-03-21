import { CModal, CModalBody, CModalFooter, CModalHeader, CFormGroup, CLabel, CInput, CButton } from '@coreui/react'
import React from 'react'

import { withRouter } from 'react-router-dom'

import useAxios from 'axios-hooks'

const NewPrescription = ({ match, show, setShow, details, refetch }) => {
  const [, fetch] = useAxios(
    {
      url: 'https://app.aloropivetcenter.com/api/treatments',
      method: 'POST',
    },
    {
      manual: true
    }
  )

  const [treatmentRecord, setTreatmentRecord] = React.useState({
    statement: '',
    prescription: '',
    description: '',
    recomendation: '',
    followUp: ''
  })

  const handleChange = (e) => {
    setTreatmentRecord(oldState => {
      return {
        ...oldState,
        [e.target.name]: e.target.value
      }
    })
  }

  const addNewPrescription = () => {
    if (!details) {
      let followUp = ''
      if (treatmentRecord?.followUp > 0) {
        const tempDate = new Date()
        tempDate.setDate(tempDate.getDate() + treatmentRecord?.followUp)

        followUp = `${tempDate.getFullYear()}-${('0' + (tempDate.getMonth() + 1)).slice(-2)}-${( '0' + tempDate.getDate()).slice(-2)}`
      } 

      const data = {
        ...treatmentRecord,
        orderId: match.params.slug.split('-')[1],
        petId: match.params.petId,
        followUp 
      }

      fetch({
        data
      }).then(resp => {
        refetch()
        setTreatmentRecord({
          statement: '',
          prescription: '',
          description: '',
          recomendation: '',
          followUp: ''
        })
        setShow(false)
      })
    }
  }

  React.useEffect(() => {
    if (show && details) {
      setTreatmentRecord({
        statement: details.statement,
        prescription: details.prescription,
        description: details.description,
        recomendation: details.recomendation,
        followUp: ''
      })
    }
  }, [details, show])

  return (
    <CModal show={show} onClose={() => setShow(false)}>
      <CModalHeader>
        {
          details ?
          'Treatment Details' :
          'New Prescription'
        }
      </CModalHeader>
      <CModalBody>
      <CFormGroup>
        <CLabel htmlFor="Statement">Statement</CLabel>
        <CInput disabled={details} value={treatmentRecord.statement} name="statement" onChange={handleChange} id="statement" placeholder="Enter Statement" />
      </CFormGroup>
      <CFormGroup>
        <CLabel htmlFor="prescription">Prescription</CLabel>
        <CInput disabled={details} value={treatmentRecord.prescription} name="prescription" onChange={handleChange} id="prescription" placeholder="Enter Prescription" />
      </CFormGroup>
      <CFormGroup>
        <CLabel htmlFor="recomendation">Recomendation</CLabel>
        <CInput disabled={details} value={treatmentRecord.recomendation} name="recomendation" onChange={handleChange} id="recomendation" placeholder="Enter Recomendation" />
      </CFormGroup>
      <CFormGroup>
        <CLabel htmlFor="description">Description</CLabel>
        <CInput disabled={details} value={treatmentRecord.description} name="description" onChange={handleChange} id="description" placeholder="Enter Description" />
      </CFormGroup>
      <CFormGroup>
        <CLabel htmlFor="followUp">Follow up ?</CLabel>
        <CInput disabled={details} type="number" value={treatmentRecord.followUp} name="followUp" onChange={handleChange} id="followUp" placeholder="Enter follow Up day" />
      </CFormGroup>
      </CModalBody>
      <CModalFooter>
        <CButton color="danger" onClick={() => setShow(false)}>Cancel</CButton>
        {
          !details &&
          <CButton onClick={addNewPrescription} color="primary">Submit</CButton>
        }
      </CModalFooter>
    </CModal>
  )
}

export default withRouter(NewPrescription)
