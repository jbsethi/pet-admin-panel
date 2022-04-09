import React, { useContext } from "react";

import useAxios from "axios-hooks";

import { withRouter } from "react-router-dom";

import { formatDate } from "../../utils/dateUtils";

import { PUBLIC_API } from "../../config/index";

import {
  CCard,
  CCol,
  CRow,
  CCardHeader,
  CCardBody,
  CDataTable,
} from "@coreui/react";

import { AppContext } from "../../App.js";

const fields = [
  {
    key: "date",
    label: "Date",
  },
  {
    key: "time",
    label: "Time",
  },
  {
    key: "price",
    label: "Bill",
  },
];

const VisitorHistory = ({ history, id }) => {
  const { addToast } = useContext(AppContext);
  const [showTable, setShowTable] = React.useState(false);
  const [{ data, loading, error }, fetch] = useAxios(
    {
      url: PUBLIC_API + "/orders/patient",
      method: "GET",
    },
    {
      manual: true,
    }
  );

  const loadData = React.useCallback(
    async (orderId) => {
      try {
        await fetch({
          url: PUBLIC_API + `/orders/patient/${id}`,
        }).then((resp) => {
          resp.data.rows.forEach((row) => {
            let dateTime = formatDate(row.createdAt).split(",");
            row.date = dateTime[0];
            row.time = dateTime[1];
          });
          setShowTable(true);
        });
      } catch (err) {
        addToast({
          message: err?.response?.data?.message || "Something went wrong !",
        });
      }
    },
    [fetch]
  );

  React.useEffect(() => {
    if (id) {
      const orderId = history?.location?.state?.orderId || null;
      loadData(orderId);
    }
  }, [id, loadData]);

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>Visitor History</CCardHeader>
          <CCardBody>
            {showTable ? (
              <CDataTable
                items={loading ? [] : error ? [] : data?.rows || []}
                fields={fields}
                striped
                pagination
                loading={loading}
              />
            ) : (
              <div></div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default withRouter(VisitorHistory);
