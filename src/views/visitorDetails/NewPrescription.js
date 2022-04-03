import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CFormGroup,
  CLabel,
  CInput,
  CButton,
  CTextarea,
  CRow,
  CCol,
} from "@coreui/react";
import React, { useContext } from "react";

import RSelect from "react-select";

import { withRouter, useHistory } from "react-router-dom";

import useAxios from "axios-hooks";
import { AppContext } from "../../App.js";
import { PUBLIC_API } from "../../config/index";

const NewPrescription = ({ match, show, setShow, details, refetch, edit }) => {
  const history = useHistory();
  const { role, addToast } = useContext(AppContext);
  const [loadingDetails, setLoadingDetails] = React.useState(false);
  const [orderData, setOrderData] = React.useState(null);
  const [selectedRecomendation, setSelectedRecomendation] = React.useState([]);
  const [treatments, setTreatments] = React.useState([]);
  const [recommendations, setRecommendations] = React.useState([]);
  const [disabled, setEditMode] = React.useState(details ? false : true);

  const [, fetch] = useAxios(
    {
      url: PUBLIC_API + "/treatments",
      method: "POST",
    },
    {
      manual: true,
    }
  );

  const [treatmentRecord, setTreatmentRecord] = React.useState({
    statement: "",
    prescription: "",
    description: "",
    followUp: "",
  });

  const handleChange = (e) => {
    setTreatmentRecord((oldState) => {
      return {
        ...oldState,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSelectChange = (option, i) => {
    setSelectedRecomendation((oldState) => {
      return [...oldState, { idx: i, ...option }];
    });
  };

  const addServiceToReceipt = (service) => {
    const data = {
      ...(!disabled && { patientId: orderData.patientId }),
      ...(!disabled && {
        appointment: orderData.appointment === "1" ? true : false,
      }),
      ...(!disabled && { checkUpPrice: orderData.checkUpPrice }),
      ...(!disabled && { description: orderData.description }),
      ...(!disabled && { followUp: orderData.followUp }),

      items: orderData.Items.map((i) => {
        return {
          itemId: i.itemId,
          quantity: i.quantity,
          discount: i.discount || 0,
        };
      }).concat([
        {
          itemId: service.value,
          quantity: 1,
          discount: 0,
        },
      ]),
      packages: orderData.Packages.map((i) => {
        return {
          id: i.id,
          quantity: i.quantity,
          discount: i.discount || 0,
        };
      }),
    };

    fetch({
      url: PUBLIC_API + `/orders/${details.orderId}`,
      method: "PUT",
      data: data,
    })
      .then((resp) => {
        loadInitialData();
      })
      .catch((err) => {
        addToast({
          message: err.response.data.message,
        });
      });
  };

  const editTreatment = () => {
    if (disabled) setEditMode(false);
    else addNewPrescription();
  };

  const addNewRecommendation = () => {
    setRecommendations((oldState) => {
      return [
        ...oldState,
        {
          serviceId: "",
        },
      ];
    });
  };

  const addNewPrescription = () => {
    if (!disabled) {
      let followUp = treatmentRecord?.followUp || null;

      const data = {
        ...treatmentRecord,
        orderId: details.orderId,
        petId: details.petId,
        followUp,
        recomendations: [...selectedRecomendation, ...recommendations.filter(rec => !!rec.serviceId)].map((r) => r.value),
      };

      fetch({
        url: PUBLIC_API + "/treatments/" + details.id,
        method: "PUT",
        data,
      })
        .then((resp) => {
          setShow(false);
          refetch();
        })
        .catch((err) => {
          addToast({
            message:
              err?.response?.data?.message || "Error Occured ! Try again later",
          });
        });
    }
  };

  const loadInitialData = React.useCallback(async () => {
    setLoadingDetails(true);
    if (show && details) {
      const resp = await fetch({
        url: PUBLIC_API + `/orders/${details.orderId}`,
        method: "GET",
      });

      setOrderData(resp.data);

      setTreatmentRecord({
        statement: details.statement,
        prescription: details.prescription,
        description: details.description,
        followUp: "",
      });

      setSelectedRecomendation(() => {
        return details.Recomendations.map((o, i) => {
          const isAdded = (resp?.data?.Items || []).find(
            (item) => item.itemId === o.itemId
          )
            ? true
            : false;
          return {
            idx: i,
            value: o.itemId,
            label: o.Item.name,
            isAdded,
          };
        });
      });
    }

    if (show && treatments.length === 0) {
      const resp = await fetch({
        url: PUBLIC_API + "/items/records/all?serviceId=3",
        method: "GET",
      });

      setTreatments(
        resp.data.map((r) => {
          return {
            label: r.name,
            value: r.id,
          };
        })
      );
    }
    setLoadingDetails(false);
  }, [treatments, show, details]);

  React.useEffect(() => {
    loadInitialData();

    return () => {
      setOrderData(null);
      setSelectedRecomendation([]);
      setEditMode(true);
    };
  }, [loadInitialData]);

  const recommendationElem = [...selectedRecomendation, ...recommendations.filter(rec => !disabled || !!rec.serviceId)].map(
    (r, i) => {
      return (
        <CRow key={i} className="align-items-center px-3 py-2">
          <CCol md="1">{i + 1}</CCol>
          <CCol
            style={{
              pointerEvents: (disabled || edit) ? "none" : "auto",
            }}
          >
            <RSelect
              disabled={disabled || edit}
              options={treatments}
              value={selectedRecomendation[i]}
              onChange={(option) => handleSelectChange(option, i)}
            ></RSelect>
          </CCol>
          <CCol md="2">
            {disabled &&
              !selectedRecomendation[i]?.isAdded &&
              role !== "doctor" && (
                <CButton
                  color="primary"
                  size="sm"
                  onClick={() => addServiceToReceipt(selectedRecomendation[i])}
                >
                  Add
                </CButton>
              )}
          </CCol>
        </CRow>
      );
    }
  );

  return (
    <CModal show={show} onClose={() => setShow(false)}>
      <CModalHeader>
        {details ? "Treatment Details" : "New Prescription"}
      </CModalHeader>
      <CModalBody>
        {loadingDetails ? (
          <p className="pt-3 text-center">Loading Please wait !</p>
        ) : (
          <>
            <CFormGroup>
              <CLabel htmlFor="Statement">Statement</CLabel>
              <CInput
                disabled={disabled}
                value={treatmentRecord.statement}
                name="statement"
                onChange={handleChange}
                id="statement"
                placeholder="Enter Statement"
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel htmlFor="prescription">Prescription</CLabel>
              <CInput
                disabled={disabled}
                value={treatmentRecord.prescription}
                name="prescription"
                onChange={handleChange}
                id="prescription"
                placeholder="Enter Prescription"
              />
            </CFormGroup>
            {(recommendationElem.length > 0 || !disabled) && (
              <CFormGroup className="py-3 m-0">
                <CRow className="px-3 justify-content-between align-items-center">
                  <CLabel htmlFor="recomendation">Recomendation</CLabel>
                  {!disabled && !edit && (
                    <CButton
                      onClick={addNewRecommendation}
                      size="sm"
                      color="primary"
                    >
                      Add Recommendation
                    </CButton>
                  )}
                </CRow>
                <section className="py-2">{recommendationElem}</section>
              </CFormGroup>
            )}

            <CFormGroup>
              <CLabel htmlFor="description">Description</CLabel>
              <CTextarea
                disabled={disabled}
                value={treatmentRecord.description}
                onChange={handleChange}
                name="description"
                id="description"
                placeholder="Enter Description"
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel htmlFor="followUp">Follow up ?</CLabel>
              <CInput
                disabled={disabled}
                type="number"
                value={treatmentRecord.followUp}
                name="followUp"
                onChange={handleChange}
                id="followUp"
                placeholder="Enter follow Up day"
              />
            </CFormGroup>
          </>
        )}
      </CModalBody>
      <CModalFooter className="justify-content-between">
        <div>
          {((role === "admin" && disabled) || (role === "superman" && disabled)) && (
            <CButton
              color="danger"
              variant="outline"
              shape="square"
              onClick={editTreatment}
            >
              Edit Treatment
            </CButton>
          )}
        </div>
        <div>
          <CButton color="danger" onClick={() => setShow(false)}>
            Cancel
          </CButton>
          {role !== "doctor" && (
            <CButton
            className="ml-2"
              color="primary"
              onClick={() =>
                !disabled ? editTreatment() :
                history.replace({
                  pathname: `/visitors/${match.params.id}/orders`,
                  state: {
                    orderId: details.orderId,
                  },
                })
              }
            >
              {disabled ? 'View Invoice' : 'Update Record'}
            </CButton>
          )}
        </div>
      </CModalFooter>
    </CModal>
  );
};

export default withRouter(NewPrescription);
