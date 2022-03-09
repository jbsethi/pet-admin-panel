import React from "react";
import useAxios from "axios-hooks";
import AddReceiptForm from "../addVisitor/ReceiptForm/AddReceiptForm";
import reducer from "../addVisitor/addVisitorReducer";
import initialState from "../addVisitor/addVisitorState";
import { PUBLIC_API } from "../../config/index";
import AddNewVisitor from "./AddNewVisitor";
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CFormGroup,
  CCol,
  CLabel,
  CDataTable,
  CCardBody,
} from "@coreui/react";
import RSelect from "react-select";
const receiptTableFields = [
  "action",
  "name",
  "category",
  "price",
  "qty",
  "total",
];

const AddNewOrder = ({ show, setOrderModal, fetchOrderRecord }) => {
  /**
   * States
   */

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [selectedUser, setSelectedUser] = React.useState(null);
  let [totalPrice, setTotalPrice] = React.useState(0);
  let [newVisitorModal, setNewVisitorModal] = React.useState(false);

  /**
   * Show add item modal
   */

  const showAddReceiptForm = (status) => {
    dispatch({ type: "setShowAddReceiptForm", payload: status });
  };

  /**
   * Remove item from list
   */

  const handleAction = (data) => {
    dispatch(data);
    totalPrice -= data.payload.total;
    setTotalPrice(totalPrice);
  };

  /**
   * Axios
   */
  const [, fetchRecord] = useAxios(
    {
      method: "GET",
    },
    { manual: true }
  );

  /**
   * Set Selected User
   */

  const handleUserChange = ({ value }) => {
    setSelectedUser(value);
  };

  /**
   * Add new Record
   */

  const addNewRecord = () => {
    if (selectedUser && state.receiptItems.length > 0) {
      let data = {
        patientId: selectedUser.id,
        items: state.receiptItems
          .filter((item) => item.id !== null)
          .map((item) => {
            return {
              itemId: item.id,
              quantity: item.qty,
              discount: item.discount || 0,
            };
          }),
        appointment: false,
        checkUpPrice: 0,
        description: "Order Receipt For Shopping",
        assignTo: null,
        packages: [],
        followUp: false,
      };
      fetchRecord({
        url: PUBLIC_API + "/orders",
        method: "POST",
        data,
      }).then((resp) => {
        setOrderModal(false);
        fetchOrderRecord();
        state.receiptItems = [];
      });
    }
  };

  /**
   * Search user on input
   */

  React.useEffect(() => {
    if (state.keyword.length > 0) {
      fetchRecord({
        url: PUBLIC_API + "/patients",
        params: {
          search: state.keyword,
        },
      }).then((resp) => {
        dispatch({
          type: "setItems",
          payload: (resp?.data?.rows || []).map((item, idx) => {
            return {
              label: idx + 1 + ": " + item.name + " - " + item.contact,
              value: item,
            };
          }),
        });
      });
    }
  }, [state.keyword, fetchRecord]);

  /**
   * Calculate total Price on add item
   */
  const calculateTotalPrice = (payload) => {
    totalPrice += payload.itemId.price;
    setTotalPrice(totalPrice);
  };
  const toggleVisitorModal = (value) => {
    setNewVisitorModal(value);
  };
  const terminateModal = () => {
    setOrderModal(false);
    state.receiptItems = [];
    setSelectedUser(null)
  };

  return (
    <>
      <CModal show={show} onClose={terminateModal}>
        <CModalHeader closeButton>Add Order</CModalHeader>
        <CModalBody>
          {/* Sreach User */}
          <CFormGroup row>
            <CCol xs="12">
              <CLabel className="pt-1" htmlFor="search">
                Search
              </CLabel>
            </CCol>
            <CCol xs="12">
              <RSelect
                name="search"
                options={state.items}
                value={{
                  label:
                    selectedUser && selectedUser.name && selectedUser.contact
                      ? `${selectedUser.name} - ${selectedUser.contact}`
                      : "",
                  value: selectedUser || {},
                }}
                onInputChange={(input) =>
                  dispatch({ type: "setKeyword", payload: input })
                }
                noOptionsMessage={() => {
                  return (
                    <>
                      <CButton
                        size="sm"
                        color="primary"
                        variant="outline"
                        className="m-2 pl-3 pr-4"
                        onClick={() => toggleVisitorModal(true)}
                      >
                        <span className="ml-1">
                          No Patient Found, Click to Add
                        </span>
                      </CButton>
                    </>
                  );
                }}
                onChange={handleUserChange}
              ></RSelect>
            </CCol>
          </CFormGroup>

          {/* Add item  */}

          <CCardBody>
            <CDataTable
              fields={receiptTableFields}
              items={state.receiptItems || []}
              footer
              hover
              scopedSlots={{
                action: (item) => (
                  <td className="px-1 py-2">
                    {
                      <CButton
                        onClick={() =>
                          handleAction({ type: "removeItem", payload: item })
                        }
                        size="sm"
                      >
                        &#10006;
                      </CButton>
                    }
                  </td>
                ),
              }}
              overTableSlot={
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="font-bold">Total Price:</span> {totalPrice}
                  </div>
                  <div className="text-right">
                    <CButton
                      size="sm"
                      color="primary"
                      variant="outline"
                      className="m-2 pl-3 pr-4"
                      onClick={() => showAddReceiptForm(true)}
                    >
                      <span className="ml-1">Add Item</span>
                    </CButton>
                  </div>
                </div>
              }
            />
          </CCardBody>
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

      {/* Receipt Form */}

      <AddReceiptForm
        show={state.showAddReceiptForm}
        setShow={showAddReceiptForm}
        dispatch={dispatch}
        calculateTotalPrice={calculateTotalPrice}
      />

      {/* Add new Visitor form */}
      <AddNewVisitor
        show={newVisitorModal}
        toggleVisitorModal={toggleVisitorModal}
        emitVisitorRecord={handleUserChange}
      />
    </>
  );
};

export default AddNewOrder;
