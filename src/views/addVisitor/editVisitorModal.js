import React, { useContext } from "react";
import useAxios from "axios-hooks";
import { PUBLIC_API } from "../../config/index";
import { AppContext } from '../../App.js'

import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CFormGroup,
  CCol,
  CLabel,
  CInput,
  CRow,
} from "@coreui/react";

const EditVisior = ({ visitorId, showModal, setEditModal }) => {
  const { addToast } = useContext(AppContext)
  const [visitor, setVisitor] = React.useState({
    name: "",
    email: "",
    contact: "",
  });

  const [, fetch] = useAxios();

  const handleChange = (e) => {
    setVisitor((oldState) => {
      return {
        ...oldState,
        [e.target.name]: e.target.value,
      };
    });
  };
  const updateVisitorDetail = () => {
    fetch({
      url: `${PUBLIC_API}patients/${visitorId}`,
      method: "PUT",
      data: visitor,
    }).then(() => {
      setEditModal(false);
    }).catch(err => {
      addToast({
        message: err.response.data.message
      })
    })
  };
  const resetForm=()=>{
    setEditModal(false,'cancel');
  }

  React.useEffect(() => {
    fetch({
      url: PUBLIC_API + `/patients/${visitorId}`,
      method: "GET",
    }).then((res) => {
      setVisitor({
        name: res.data.name,
        email: res.data.email,
        contact: res.data.contact,
      });
    });
  }, [fetch, visitorId]);

  return (
    <>
      <CModal show={showModal}>
        <CModalHeader closeButton>Edit Visitor</CModalHeader>
        <CModalBody>
          {false ? (
            <div className="py-5 text-center">Loading Details ...</div>
          ) : (
            <CRow>
              <CCol className="px-5 pt-4">
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel className="pt-1" htmlFor="text-name">
                      Name
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      id="text-name"
                      name="name"
                      value={visitor.name}
                      placeholder="Enter Name for item"
                      onChange={handleChange}
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel className="pt-1" htmlFor="text-email">
                      Email
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      id="text-price"
                      name="email"
                      value={visitor.email}
                      onChange={handleChange}
                      placeholder="Enter Price for item"
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel className="pt-1" htmlFor="text-contach">
                      Contact
                    </CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput
                      id="text-price"
                      name="contact"
                      value={visitor.contact}
                      placeholder="Enter Price for item"
                      onChange={handleChange}
                    />
                  </CCol>
                </CFormGroup>
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          {
            <CButton color="secondary" onClick={resetForm}>
              Cancel
            </CButton>
          }
          {
            <CButton
              className="ml-1"
              color="primary"
              onClick={updateVisitorDetail}
            >
              {false ? "Loading" : "Update"}
            </CButton>
          }
        </CModalFooter>
      </CModal>
    </>
  );
};

export default EditVisior;
