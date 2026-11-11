import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { EmptyState, ErrorAlert, Field, LoadingState, StatusBadge } from "../../../components/portal/Portal";
import { adminApi } from "../../../services/api/adminApi";
import { formatDateTime, formatMoney } from "../../../utils/format";
import { adminKeys, Pagination, SearchBar } from "../adminShared";

const PAGE_SIZE = 20;
const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "PendingPayment", label: "Pending payment" },
  { value: "Paid", label: "Paid" },
  { value: "Cancelled", label: "Cancelled" },
];

export default function PaymentsTab() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const orders = useQuery({
    queryKey: [...adminKeys.orders, status, search, page],
    queryFn: ({ signal }) => adminApi.listOrders({ status, search, pageNumber: page, pageSize: PAGE_SIZE }, signal),
    placeholderData: keepPreviousData,
  });

  return (
    <section aria-label="Payments">
      <div className="portal-row-between" style={{ marginBottom: 14, alignItems: "flex-end" }}>
        <Field label="Order status">
          {(id) => (
            <select
              id={id}
              className="portal-select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
        </Field>
        <SearchBar
          label="Search by learner e-mail"
          onSearch={(term) => {
            setSearch(term);
            setPage(1);
          }}
        />
      </div>

      <ErrorAlert error={orders.error} />

      {orders.isLoading ? (
        <LoadingState label="Loading orders…" />
      ) : !orders.data || orders.data.items.length === 0 ? (
        <EmptyState title="No orders found" />
      ) : (
        <>
          <div className="portal-table-wrap" tabIndex={0}>
            <table className="portal-table">
              <thead>
                <tr>
                  <th scope="col">Learner</th>
                  <th scope="col">Course</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Attempts</th>
                  <th scope="col">Created</th>
                  <th scope="col">Paid at</th>
                </tr>
              </thead>
              <tbody>
                {orders.data.items.map((o) => (
                  <tr key={o.id}>
                    <td>{o.learnerEmail}</td>
                    <td>{o.title}</td>
                    <td>{formatMoney(o.amountDue, o.currency)}</td>
                    <td>
                      <StatusBadge status={o.status} />
                    </td>
                    <td>{o.attemptCount}</td>
                    <td>{formatDateTime(o.createdAt)}</td>
                    <td>{formatDateTime(o.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination pageNumber={orders.data.pageNumber} totalPages={orders.data.totalPages} onChange={setPage} />
        </>
      )}
    </section>
  );
}
