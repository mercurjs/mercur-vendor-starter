import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";

import { getColor } from "../../../utils/color";
import { formatAmountWithSymbol } from "../../../utils/prices";
import Tooltip from "../../atoms/tooltip";
import StatusDot from "../../fundamentals/status-indicator";
import CustomerAvatarItem from "../../molecules/customer-avatar-item";
import StatusIndicator from "../../fundamentals/status-indicator";

const useOrderTableColums = () => {
  const { t } = useTranslation();
  const decideStatus = (status) => {
    switch (status) {
      case "captured":
        return (
          <StatusDot variant="success" title={t("order-table-paid", "Paid")} />
        );
      case "awaiting":
        return (
          <StatusDot
            variant="default"
            title={t("order-table-awaiting", "Awaiting")}
          />
        );
      case "requires_action":
        return (
          <StatusDot
            variant="danger"
            title={t("order-table-requires-action", "Requires action")}
          />
        );
      case "canceled":
        return (
          <StatusDot
            variant="warning"
            title={t("order-table-canceled", "Canceled")}
          />
        );
      default:
        return (
          <StatusDot variant="primary" title={t("order-table-n-a", "N/A")} />
        );
    }
  };

  const decideFulfillmentStatus = (status: string) => {
    switch (status) {
      case "fulfilled":
        return <p>{t("customer-orders-table-fulfilled", "Fulfilled")}</p>;
      case "shipped":
        return <p>{t("customer-orders-table-shipped", "Shipped")}</p>;
      case "not_fulfilled":
        return (
          <p>{t("customer-orders-table-not-fulfilled", "Not fulfilled")}</p>
        );
      case "partially_fulfilled":
        return (
          <p>
            {t(
              "customer-orders-table-partially-fulfilled",
              "Partially fulfilled"
            )}
          </p>
        );
      case "partially_shipped":
        return (
          <p>
            {t("customer-orders-table-partially-shipped", "Partially shipped")}
          </p>
        );
      case "requires":
        return (
          <p>{t("customer-orders-table-requires-action", "Requires action")}</p>
        );
      default:
        return <p>{t("customer-orders-table-n-a", "N/A")}</p>;
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: <div className="pl-2">{t("order-table-order", "Order")}</div>,
        accessor: "display_id",
        Cell: ({ cell: { value } }) => (
          <p className="text-grey-90 group-hover:text-violet-60 min-w-[100px] pl-2">{`#${value}`}</p>
        ),
      },
      {
        Header: t("order-table-date-added", "Date added"),
        accessor: "created_at",
        Cell: ({ cell: { value } }) => (
          <div>
            <Tooltip content={moment(value).format("DD MMM YYYY hh:mm a")}>
              {moment(value).format("DD MMM YYYY")}
            </Tooltip>
          </div>
        ),
      },
      {
        Header: t("order-table-customer", "Customer"),
        accessor: "customer",
        Cell: ({ row, cell: { value } }) => (
          <div>
            <CustomerAvatarItem
              customer={{
                first_name:
                  value?.first_name ||
                  row.original.shipping_address?.first_name,
                last_name:
                  value?.last_name || row.original.shipping_address?.last_name,
                email: row.original.email,
              }}
              color={getColor(row.index)}
            />
          </div>
        ),
      },
      {
        Header: t("order-table-fulfillment", "Fulfillment"),
        accessor: "fulfillment_status",
        Cell: ({ cell: { value } }) => decideFulfillmentStatus(value),
      },
      {
        Header: t("order-table-payment-status", "Payment status"),
        accessor: "payment_status",
        Cell: ({ cell: { value } }) => decideStatus(value),
      },
      {
        Header: () => (
          <div className="text-right">{t("order-table-total", "Total")}</div>
        ),
        accessor: "total",
        Cell: ({ row, cell: { value } }) => (
          <div className="text-right">
            {formatAmountWithSymbol({
              amount: value,
              currency: row.original.currency_code,
              digits: 2,
            })}
          </div>
        ),
      },
      {
        Header: "",
        accessor: "currency_code",
        Cell: ({ cell: { value } }) => (
          <div className="text-grey-40 text-right">{value.toUpperCase()}</div>
        ),
      },
    ],
    []
  );

  return [columns];
};

export default useOrderTableColums;
