import React from "react";
import useAxios from "axios-hooks";
import { useHistory } from "react-router-dom";
import TableHeader from "../base/tableHeader/TableHeader";

import { formatDate } from "../../utils/dateUtils";
import { PUBLIC_API } from "../../config/index";
import EditVisitorModal from "../addVisitor/editVisitorModal";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CPagination,
} from "@coreui/react";

import { AppContext } from "../../App.js";

const fields = [
  "name",
  {
    key: "createdAt",
    label: "Registered",
  },
  "email",
  "contact",
  {
    key: "edit",
    label: "",
    _style: { width: "1%" },
    sorter: false,
    filter: false,
  },
  {
    key: "delete",
    label: "",
    _style: { width: "1%" },
    sorter: false,
    filter: false,
  },
];

const Visitors = () => {
  const { role, addToast } = React.useContext(AppContext);
  const [keyword, setKeyword] = React.useState("");
  const [searchString, setSearchString] = React.useState(undefined);
  const [pageNo, setPageNo] = React.useState(1);
  const [visitorId, setVisitorId] = React.useState("");
  const [editModal, setEditModal] = React.useState(false);
  const history = useHistory();

  const handleClick = () => {
    history.push("/visitors/add");
  };

  const [{ data, loading, error }, fetch] = useAxios(
    {
      url: PUBLIC_API + "/patients",
      method: "GET",
    },
    {
      manual: true,
    }
  );

  const updatePageNo = (no) => {
    setPageNo(no);
  };

  const changeKeyword = (e) => {
    if (e.key === "Enter") {
      setSearchString(keyword);
    } else {
      setKeyword(e.target.value);
    }
  };
  const showEditVisitorModal = (e, item) => {
    e.stopPropagation();
    setEditModal(true);
    setVisitorId(item.id);
  };
  const hideEditModal = (payload, action) => {
    setEditModal(payload);
    if (action !== "cancel")
      fetch(
        {
          url: PUBLIC_API + "/patients",
          method: "GET",
        },
        {
          manual: true,
        }
      );
  };
  const deleteRecord = (e, item) => {
    e.stopPropagation();
    fetch({
      url: `${PUBLIC_API}patients/${item.id}`,
      method: "Delete",
    }).then(() => {
      fetch();
    });
  };

  React.useEffect(() => {
    if (typeof searchString != "undefined") {
      fetch({
        params: {
          search: searchString,
          pageNo: 1,
        },
      }).catch((err) => {
        addToast({
          message: err?.response?.data?.message,
        });
      });
    }
  }, [fetch, searchString]);

  React.useEffect(() => {
    fetch({
      params: {
        search: searchString,
        pageNo: pageNo,
      },
    }).catch((err) => {
      addToast({
        message: err?.response?.data?.message,
      });
    });
  }, [fetch, pageNo]);

  return (
    <>
      <EditVisitorModal
        visitorId={visitorId}
        showModal={editModal}
        setEditModal={hideEditModal}
      />
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>Visitors</CCardHeader>
            <CCardBody>
              <CDataTable
                items={loading ? [] : error ? [] : data?.rows || []}
                fields={fields}
                striped
                style={{
                  'pointerEvents': 'pointer'
                }}
                itemsPerPage={data?.pageSize || 10}
                pagination
                loading={loading}
                onRowClick={(item) =>
                  history.push(`/visitors/${item.id}/details`)
                }
                scopedSlots={{
                  createdAt: (item) => <td>{formatDate(item.createdAt)}</td>,
                  edit: (item, index) => {
                    return (
                      <td className="py-2 px-1">
                        {
                          (role === 'administrator' || role === 'superman') && (
                            <CButton
                              color="success"
                              variant="outline"
                              shape="square"
                              size="sm"
                              onClick={(e) => {
                                showEditVisitorModal(e, item);
                              }}
                            >
                              Edit
                            </CButton>
                          )
                        }
                      </td>
                    );
                  },
                  delete: (item, index) => {
                    return (
                      <td className="py-2 px-1">
                        {
                          (role == 'administrator' || role == 'superman') && (
                            <CButton
                              color="primary"
                              variant="outline"
                              shape="square"
                              size="sm"
                              onClick={(e) => {
                                deleteRecord(e, item);
                              }}
                            >
                              Delete
                            </CButton>
                          )
                        }
                      </td>
                    );
                  },
                }}
                overTableSlot={
                  role !== "doctor" && (
                    <TableHeader
                      keyword={keyword}
                      changeKeyword={changeKeyword}
                    >
                      <CButton
                        color="primary"
                        variant="outline"
                        className="m-2 pl-3 pr-4"
                        onClick={handleClick}
                      >
                        <span className="ml-1">Add Visit</span>
                      </CButton>
                    </TableHeader>
                  )
                }
                underTableSlot={
                  <CPagination
                    activePage={data?.pageNo || 1}
                    pages={data?.totalPages || 1}
                    onActivePageChange={(i) => updatePageNo(i)}
                  ></CPagination>
                }
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Visitors;
