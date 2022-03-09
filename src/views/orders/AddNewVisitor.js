import React, { useContext } from "react";
import useAxios from "axios-hooks";
import { PUBLIC_API } from "../../config/index";

import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CFormGroup,
  CInput,
  CLabel,
} from "@coreui/react";
import { AppContext } from "../../App.js";

const AddNewVisitor = ({ show, toggleVisitorModal, emitVisitorRecord }) => {
  const [visitorData, setVisitorData] = React.useState({
    contact: "",
    email: "",
    emiratesId: "",
    name: "",
  });
  const { addToast } = useContext(AppContext);

  const [_, fetch] = useAxios(
    {
      url: PUBLIC_API + "patients",
      method: "POST",
    },
    { manual: true }
  );

  const handleChange = (e) => {
    setVisitorData((oldState) => {
      return {
        ...oldState,
        [e.target.name]: e.target.value,
      };
    });
  };

  const addNewRecord = () => {
    let data = visitorData;
    fetch({
      url: PUBLIC_API + "patients",
      method: "POST",
      data: data,
    })
      .then((res) => {
        emitVisitorRecord({ value: res.data });
        toggleVisitorModal(false);
      })
      .catch((error) => {
        addToast({
          message: error.message,
        });
      });
  };
  const terminateModal = () => {
    toggleVisitorModal(false);
    setVisitorData({
      contact: "",
      email: "",
      emiratesId: "",
      name: "",
    });
  };
  return (
    <>
      <CModal show={show} onClose={terminateModal}>
        <CModalHeader closeButton>Add New Visitor</CModalHeader>
        <CModalBody>
          <CFormGroup>
            <CLabel htmlFor="contact">Phone No</CLabel>
            <CInput
              name="contact"
              id="contact"
              value={visitorData.contact}
              placeholder="Enter Phone number"
              onChange={handleChange}
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="name">Visitors Name</CLabel>
            <CInput
              id="name"
              name="name"
              value={visitorData.name}
              placeholder="Enter Visitor's name"
              onChange={handleChange}
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="email">Email</CLabel>
            <CInput
              id="email"
              name="email"
              value={visitorData.email}
              placeholder="Enter Visitor's email"
              onChange={handleChange}
            />
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="emiratesId">Visitors Emirates ID</CLabel>
            <CInput
              id="emiratesId"
              name="emiratesId"
              value={visitorData.emiratesId}
              placeholder="Enter Visitor's emirates id"
              onChange={handleChange}
            />
          </CFormGroup>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={terminateModal}>
            Cancel
          </CButton>
          <CButton className="ml-1" color="primary" onClick={addNewRecord}>
            Add
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default AddNewVisitor;
