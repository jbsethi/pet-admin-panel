import { CModal, CModalBody, CModalFooter, CModalHeader, CFormGroup, CLabel, CInput, CButton, CTextarea, CRow, CCol } from '@coreui/react'
import React from 'react'

import RSelect from 'react-select';

import { withRouter } from 'react-router-dom'

import useAxios from 'axios-hooks'
import { AppContext } from '../../App'

const NewPrescription = ({ match, show, setShow, details, refetch }) => {
  const { addToast } = React.useContext(AppContext)
  const [recommendations, setRecommendations] = React.useState([])
  const [selectedRecomendation, setSelectedRecomendation] = React.useState([])
  const [treatments, setTreatments] = React.useState([])

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

  const handleSelectChange = (option, i) => {
    setSelectedRecomendation((oldState => {
      return [...oldState, { idx: i, ...option }]
    }))
  }

  const addNewPrescription = () => {
    if (!details) {
      let followUp = treatmentRecord?.followUp || null

      const data = {
        ...treatmentRecord,
        orderId: match.params.slug.split('-')[1],
        petId: match.params.petId,
        followUp ,
        recomendations: selectedRecomendation.map(r => r.value)
      }

      fetch({
        data
      }).then(resp => {
        refetch()
        setTreatmentRecord({
          statement: '',
          prescription: '',
          description: '',
          followUp: ''
        })
        setShow(false)
      }).catch((err) => {
        addToast({
          message: err?.response?.data?.message || 'Error Occured ! Try again later'
        })
      })
    }
  }

  React.useEffect(() => {
    if (show && details) {
      setTreatmentRecord({
        statement: details.statement,
        prescription: details.prescription,
        description: details.description,
        followUp: ''
      })

      setSelectedRecomendation(() => {
        return details.Recomendations.map((o, i) => {
          addNewRecommendation()
          return {
            idx: i,
            value: o.itemId,
            label: o.Item.name
          }
        })
      })
    }

    return () => {
      setRecommendations([])
      setSelectedRecomendation([])
    }
  }, [details, show])

  const recommendationElem = recommendations.map((r, i) => {
    return (
      <CRow key={i} className="align-items-center px-3 py-2">
        <CCol md="1">{i+1}</CCol>
        <CCol>
          <RSelect disabled={details} options={treatments} value={selectedRecomendation.find(o => o.idx === i)} onChange={(option) => handleSelectChange(option, i)}></RSelect>
        </CCol>
        <CCol md="2">
          {
            !details &&
            <CButton onClick={() => removeRecommendation(i)} size="sm">Remove</CButton>
          }
        </CCol>
      </CRow>
    )
  })

  const addNewRecommendation = () => {
    setRecommendations((oldState) => {
      return [...oldState, {
        serviceId: ''
      }]
    })
  }

  const removeRecommendation = (i) => {
    setRecommendations((oldState) => {
      return oldState.filter((r, idx) => idx !== i)
    })

    setSelectedRecomendation((oldState => {
      return oldState.filter(op => op.idx !== i)
    }))
  }

  React.useEffect(() => {
    if (show && treatments.length === 0) {
      fetch({
        url: 'https://app.aloropivetcenter.com/api/items/records/all?serviceId=3',
        method: 'GET'
      }).then(resp => {
        setTreatments(resp.data.map(r => {
          return {
            label: r.name,
            value: r.id
          }
        }))
      })
    }
  }, [show, treatments, fetch])

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
      
      <CFormGroup className="py-3 m-0">
        <CRow className="px-3 justify-content-between align-items-center">
          <CLabel htmlFor="recomendation">Recomendation</CLabel>
          {
            !details &&
            <CButton onClick={addNewRecommendation} size="sm" color="primary">Add Recommendation</CButton>
          }
        </CRow>
        {
          recommendationElem.length > 0 &&
          <section className="py-2">
            {recommendationElem}
          </section>
        }
        {/* <CRow className="align-items-center px-3 py-4">
          <CCol md="1">1</CCol>
          <CCol>
            <CInput></CInput>
          </CCol>
          <CCol md="2">
            <CButton size="sm">Remove</CButton>
          </CCol>
        </CRow> */}
        {/* <CInput disabled={details} value={treatmentRecord.recomendation} name="recomendation" onChange={handleChange} id="recomendation" placeholder="Enter Recomendation" /> */}
      </CFormGroup>

      <CFormGroup>
        <CLabel htmlFor="description">Description</CLabel>
        <CTextarea 
          disabled={details}
          value={treatmentRecord.description}
          onChange={handleChange}
          name="description"
          id="description" 
          placeholder="Enter Description"
        />
      </CFormGroup>
      <CFormGroup>
        <CLabel htmlFor="followUp">Follow up ?</CLabel>
        <CInput disabled={details} type="date" value={treatmentRecord.followUp} name="followUp" onChange={handleChange} id="followUp" placeholder="Enter follow Up day" />
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
