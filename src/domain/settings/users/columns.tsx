import { useMemo } from "react";
import { User } from "@medusajs/medusa";
import { StatusBadge } from "@medusajs/ui";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";

const columnHelper = createColumnHelper<User>();

export const useUserTableColumns = () => {
  const columns = useMemo(
    () => [
      columnHelper.accessor("email", {
        id: "email",
        header: "E-mail",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("role", {
        id: "role",
        header: "Role",
        cell: (info) => (
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("created_at", {
        id: "created_at",
        header: "Joined",
        cell: (info) => (
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {moment(info.getValue()).format("MMM Do YYYY")}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        id: "status",
        header: "Status",
        cell: (info) => {
          const isRejected = info.getValue() === "rejected";
          const isPending = info.getValue() === "pending";

          const color = isRejected ? "red" : isPending ? "grey" : "green";

          const text = isRejected
            ? "Rejected"
            : isPending
            ? "Pending"
            : "Active";

          return (
            <StatusBadge color={color}>
              <span className="capitalize">{text}</span>
            </StatusBadge>
          );
        },
      }),
    ],
    []
  );

  return columns;
};
