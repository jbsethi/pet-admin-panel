import { CModal, CModalBody, CModalFooter, CModalHeader, CFormGroup, CLabel, CInput, CButton, CTextarea, CRow, CCol } from '@coreui/react'
import React, {useContext} from 'react'

import RSelect from 'react-select';

import { withRouter, useHistory } from 'react-router-dom'

import useAxios from 'axios-hooks'
import { AppContext } from '../../App.js'

const NewPrescription = ({ match, show, setShow, details, refetch }) => {
  const history = useHistory()
  const { role, addToast } = useContext(AppContext)
  const [loadingDetails, setLoadingDetails] = React.useState(false)
  const [orderData, setOrderData] = React.useState(null)
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

  const addServiceToReceipt = (service) => {
    const data = {
      patientId: orderData.patientId,
      appointment: orderData.appointment === '1' ? true : false,
      checkUpPrice: orderData.checkUpPrice,
      description: orderData.description,
      items: orderData.Items.map(i => {
        return {
          itemId: i.itemId,
          quantity: i.quantity
        }
      }).concat([{
        itemId: service.value,
        quantity: 1
      }]),
      packages: orderData.Packages.map(i => {
        return {
          id: i.id,
          quantity: i.quantity
        }
      }),
      followUp: orderData.followUp
    }

    fetch({
      url: `https://app.aloropivetcenter.com/api/orders/${details.orderId}`,
      method: 'PUT',
      data: data
    }).then(resp => {
      loadInitialData()
    }).catch(err => {
      addToast({
        message: err.response.data.message
      })
    })
  }

  const loadInitialData = React.useCallback(async () => {
    setLoadingDetails(true)
    if (show && details) {
      
      const resp = await fetch({
        url: `https://app.aloropivetcenter.com/api/orders/${details.orderId}`,
        method: 'GET'
      })

      setOrderData(resp.data)

      setTreatmentRecord({
        statement: details.statement,
        prescription: details.prescription,
        description: details.description,
        followUp: ''
      })

      setSelectedRecomendation(() => {
        return details.Recomendations.map((o, i) => {
          const isAdded = (resp?.data?.Items || []).find(item => item.itemId === o.itemId) ? true : false
          return {
            idx: i,
            value: o.itemId,
            label: o.Item.name,
            isAdded
          }
        })
      })
    }

    if (show && treatments.length === 0) {
      const resp = await fetch({
        url: 'https://app.aloropivetcenter.com/api/items/records/all?serviceId=3',
        method: 'GET'
      })

      setTreatments(resp.data.map(r => {
        return {
          label: r.name,
          value: r.id
        }
      }))
    }
    setLoadingDetails(false)
  }, [treatments, show, details])

  React.useEffect(() => {
    
    loadInitialData()

    return () => {
      setOrderData(null)
      setSelectedRecomendation([])
    }
  }, [loadInitialData])

  const recommendationElem = selectedRecomendation.map((r, i) => {
    return (
      <CRow key={i} className="align-items-center px-3 py-2">
        <CCol md="1">{i+1}</CCol>
        <CCol>
          <RSelect disabled={details} options={treatments} value={selectedRecomendation[i]} onChange={(option) => handleSelectChange(option, i)}></RSelect>
        </CCol>
        <CCol md="2">
          {
            details && !selectedRecomendation[i].isAdded && role !== 'doctor' &&
            <CButton color="primary" size="sm" onClick={() => addServiceToReceipt(selectedRecomendation[i])}>Add</CButton>
          }
        </CCol>
      </CRow>
    )
  })

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
      {
        loadingDetails ?
        <p className="pt-3 text-center">Loading Please wait !</p> : (
        <>
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
          </CRow>
          {
            recommendationElem.length > 0 &&
            <section className="py-2">
              {recommendationElem}
            </section>
          }
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
          <CInput disabled={details} type="number" value={treatmentRecord.followUp} name="followUp" onChange={handleChange} id="followUp" placeholder="Enter follow Up day" />
        </CFormGroup>
        </>
        )
      }
      </CModalBody>
      <CModalFooter>
        <CButton color="danger" onClick={() => setShow(false)}>Cancel</CButton>
        <CButton color="primary" onClick={() => history.replace({
          pathname: `/visitors/${match.params.id}/orders`,
          state: {
            orderId: details.orderId
          }
        })}>View Invoice</CButton>
      </CModalFooter>
    </CModal>
  )
}

export default withRouter(NewPrescription)
