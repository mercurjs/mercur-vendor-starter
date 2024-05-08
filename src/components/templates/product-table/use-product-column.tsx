import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useAdminStore, useAdminUpdateProduct } from "medusa-react";

import useNotification from "../../../hooks/use-notification";
import { getErrorMessage } from "../../../utils/error-messages";
import { defaultChannelsSorter } from "../../../utils/sales-channel-compare-operator";
import ListIcon from "../../fundamentals/icons/list-icon";
import TileIcon from "../../fundamentals/icons/tile-icon";
import ImagePlaceholder from "../../fundamentals/image-placeholder";
import DelimitedList from "../../molecules/delimited-list";
import IconTooltip from "../../molecules/icon-tooltip";
import ProductStatusSelector from "../../molecules/product-status-selector";

// reference: https://github.com/medusajs/medusa/blob/develop/packages/medusa-react/src/hooks/admin/products/queries.ts#L16
const ADMIN_PRODUCT_QUERY_KEY = "admin_products";

const useProductTableColumn = ({ setTileView, setListView, showList }) => {
  const { t } = useTranslation();
  const client = useQueryClient();

  const triggerRefetch = () => {
    client.invalidateQueries([ADMIN_PRODUCT_QUERY_KEY]);
  };

  const notification = useNotification();

  const { store } = useAdminStore();

  const getProductSalesChannels = (salesChannels) => {
    const salesChannelsNames = (salesChannels || [])
      .sort(defaultChannelsSorter(store?.default_sales_channel_id || ""))
      .map((sc) => sc.name);

    return <DelimitedList list={salesChannelsNames} />;
  };

  const columns = useMemo(
    () => [
      {
        Header: t("product-table-name", "Name"),
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">
              <div className="my-1.5 mr-4 flex h-[40px] w-[30px] items-center">
                {original.thumbnail ? (
                  <img
                    src={original.thumbnail}
                    className="rounded-soft h-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              {original.title}
            </div>
          );
        },
      },
      {
        Header: () => (
          <div className="flex items-center gap-1">
            Status
            <IconTooltip
              maxWidth={400}
              content={"Click on status indicator to change products status"}
            />
          </div>
        ),
        accessor: "status",
        Cell: ({ cell: { row, value } }) => {
          const { mutate: update } = useAdminUpdateProduct(row.original.id, {
            onSuccess: () => {
              notification(
                "Success",
                "Succesfully updated product status",
                "success"
              );
              triggerRefetch();
            },
            onError: (err) => {
              notification("Error", getErrorMessage(err), "error");
            },
          });

          return (
            <ProductStatusSelector
              onChange={(status) => update({ status })}
              value={value}
              onClick={(e) => e.stopPropagation()}
            />
          );
        },
      },
      {
        Header: t("product-table-availability", "Availability"),
        accessor: "sales_channels",
        Cell: ({ cell: { value } }) => getProductSalesChannels(value),
      },
      {
        Header: t("product-table-inventory", "Inventory"),
        accessor: "variants",
        Cell: ({ cell: { value } }) => (
          <div>
            {value.reduce((acc, next) => acc + next.inventory_quantity, 0)}
            {t(
              "product-table-inventory-in-stock-count",
              " in stock for {{count}} variant(s)",
              { count: value.length }
            )}
          </div>
        ),
      },
      {
        accessor: "col-3",
        Header: (
          <div className="flex justify-end text-right">
            <span
              onClick={setListView}
              className={clsx("hover:bg-grey-5 cursor-pointer rounded p-0.5", {
                "text-grey-90": showList,
                "text-grey-40": !showList,
              })}
            >
              <ListIcon size={20} />
            </span>
            <span
              onClick={setTileView}
              className={clsx("hover:bg-grey-5 cursor-pointer rounded p-0.5", {
                "text-grey-90": !showList,
                "text-grey-40": showList,
              })}
            >
              <TileIcon size={20} />
            </span>
          </div>
        ),
      },
    ],
    [showList]
  );

  return [columns] as const;
};

export default useProductTableColumn;
