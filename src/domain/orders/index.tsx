import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";

import Spacer from "../../components/atoms/spacer";
import BodyCard from "../../components/organisms/body-card";
import OrderTable from "../../components/templates/order-table";

import Details from "./details";

const OrderIndex = () => {
  const { t } = useTranslation();
  const [contextFilters, setContextFilters] =
    useState<Record<string, { filter: string[] }>>();

  return (
    <>
      <div className="gap-y-xsmall flex h-full grow flex-col">
        <div className="flex w-full grow flex-col">
          <BodyCard
            customHeader={
              <p className="text-large font-semibold">
                {t("sidebar-orders", "Orders")}
              </p>
            }
            className="h-fit"
          >
            <OrderTable setContextFilters={setContextFilters} />
          </BodyCard>
        </div>
        <Spacer />
      </div>
    </>
  );
};

const Orders = () => {
  return (
    <Routes>
      <Route index element={<OrderIndex />} />
      <Route path="/:id" element={<Details />} />
    </Routes>
  );
};

export default Orders;
