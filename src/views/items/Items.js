import React, { useContext } from "react";
import useAxios from "axios-hooks";
import TableHeader from "../base/tableHeader/TableHeader";
import AddItem from "./AddItem";

import { formatDate } from "../../utils/dateUtils";

import { AppContext } from "../../App.js";
import { PUBLIC_API } from "../../config/index";

import style from "./items.module.css";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CPagination,
  CInput,
  CSelect,
} from "@coreui/react";

const fields = [
  "name",
  "price",
  {
    key: "vat",
    label: "Vat Price",
  },
  "total",
  {
    key: "createdAt",
    label: "Registered",
  },
  "description",
  "actions",
];

const Items = () => {
  const [vatPercentage, setVatPercentage] = React.useState("5");
  const { addToast, role } = useContext(AppContext);
  const [show, setShow] = React.useState(false);

  const [keyword, setKeyword] = React.useState("");
  const [petTypes, setPetTypes] = React.useState([]);
  const [selectedPetId, setSelectedPetId] = React.useState("");

  const [totalPages, setTotalPages] = React.useState(1);
  const [currentPage, setActivePage] = React.useState(1);

  const [editId, setEditId] = React.useState(null);

  let [{ data, loading, error }, fetch] = useAxios(
    {
      url: PUBLIC_API + "items",
      method: "GET",
      params: {
        pageNo: currentPage,
      },
    },
    {
      manual: true,
    }
  );

  const changeKeyword = (e) => {
    if (e.key === "Enter") {
      fetch({
        params: {
          search: keyword,
        },
      }).catch((err) => {
        addToast({
          message: err.response.data.message,
        });
      });
    } else {
      setKeyword(e.target.value);
    }
  };

  const editModal = (id) => {
    setEditId(id);
    setShow(true);
  };

  const loadData = React.useCallback(async () => {
    await fetch({
      url: PUBLIC_API + "pet-types/records/active",
      method: "GET",
    }).then((response) => {
      setPetTypes(response.data);
    });

    await fetch().then((resp) => {
      setTotalPages(resp.data.totalPages);
    });
  }, [fetch]);

  const deleteItem = (id) => {
    fetch({
      url: PUBLIC_API + `/items/${id}`,
      method: "DELETE",
    }).then(() => {
      loadData();
    });
  };
  const setRecords = (payload, pages) => {
    data.rows = payload;
    setTotalPages(pages);
  };

  const handleChange = (e) => {
    setSelectedPetId(e.target.value);
    if (e.target.value === "0")
      fetch().then((res) => {
        setRecords(res.data, res.data.totalPages);
      });
    else
      fetch({
        params: {
          petTypeId: e.target.value,
          pageNo: currentPage,
        },
      }).then((res) => {
        setRecords(res.data, res.data.totalPages);
      });
  };

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>Items</CCardHeader>
            <CCardBody>
              <CDataTable
                items={loading ? [] : error ? [] : data?.rows || []}
                fields={fields.filter((field) => {
                  if ("actions" == field && role == "receptionist") {
                    return false;
                  }

                  return true;
                })}
                striped
                itemsPerPage={10}
                loading={loading}
                overTableSlot={
                  <>
                    <TableHeader
                      keyword={keyword}
                      changeKeyword={changeKeyword}
                    >
                      <CButton
                        color="primary"
                        variant="outline"
                        className="m-2 pl-3 pr-4"
                        onClick={() => setShow(true)}
                      >
                        <span className="ml-1">Add Item</span>
                      </CButton>
                    </TableHeader>
                    <div className="mb-4">
                      <CSelect
                        onChange={handleChange}
                        value={selectedPetId}
                        custom
                        name="petTypeId"
                        id="text-pet-type"
                      >
                        <option value="0">Select Pet Type</option>
                        {petTypes.map((petType) => {
                          return (
                            <option key={petType.id} value={petType.id}>
                              {petType.name}
                            </option>
                          );
                        })}
                      </CSelect>
                    </div>
                    <div className="ml-1 mb-2 d-flex align-items-center">
                      <div className={style["vat"]}>
                        Apply{" "}
                        <span className={style["inline-input-span"]}>
                          <input
                            style={{
                              width: `${15 + (vatPercentage.length - 1) * 8}px`,
                            }}
                            className={style["inline-input"]}
                            value={vatPercentage}
                            onChange={(e) => setVatPercentage(e.target.value)}
                          />
                          %
                        </span>{" "}
                        vat on all items.
                      </div>
                    </div>
                  </>
                }
                underTableSlot={
                  <CPagination
                    activePage={currentPage}
                    pages={totalPages}
                    onActivePageChange={(i) => setActivePage(i)}
                  ></CPagination>
                }
                scopedSlots={{
                  price: (item) => <td>{item.price} AED</td>,
                  vat: (item) => (
                    <td>{(item.price * +vatPercentage) / 100} AED</td>
                  ),
                  total: (item) => (
                    <td>
                      {item.price + (item.price * +vatPercentage) / 100} AED
                    </td>
                  ),
                  createdAt: (item) => <td>{formatDate(item.createdAt)}</td>,
                  actions: (item) => (
                    <td>
                      {role !== "receptionist" && (
                        <>
                          <CButton
                            onClick={() => editModal(item.id)}
                            color="primary"
                            size="sm"
                            className="mr-1"
                          >
                            Edit
                          </CButton>
                          <CButton
                            onClick={() => deleteItem(item.id)}
                            color="danger"
                            size="sm"
                          >
                            Delete
                          </CButton>
                        </>
                      )}
                    </td>
                  ),
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <AddItem
        show={show}
        setShow={setShow}
        refetch={fetch}
        itemId={editId}
        setEditId={setEditId}
      />
    </>
  );
};

export default Items;
