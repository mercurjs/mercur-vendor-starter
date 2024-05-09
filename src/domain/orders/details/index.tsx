import { useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ClaimOrder, Fulfillment, LineItem, Swap } from "@medusajs/medusa";
import {
  useAdminCancelOrder,
  useAdminOrder,
  useAdminReservations,
} from "medusa-react";
import moment from "moment";

import Avatar from "../../../components/atoms/avatar";
import BackButton from "../../../components/atoms/back-button";
import Spacer from "../../../components/atoms/spacer";
import Spinner from "../../../components/atoms/spinner";
import Tooltip from "../../../components/atoms/tooltip";
import Button from "../../../components/fundamentals/button";
import CancelIcon from "../../../components/fundamentals/icons/cancel-icon";
import ClipboardCopyIcon from "../../../components/fundamentals/icons/clipboard-copy-icon";
import CornerDownRightIcon from "../../../components/fundamentals/icons/corner-down-right-icon";
import BodyCard from "../../../components/organisms/body-card";
import Timeline from "../../../components/organisms/timeline";
import TransferOrdersModal from "../../../components/templates/transfer-orders-modal";
import useClipboard from "../../../hooks/use-clipboard";
import useImperativeDialog from "../../../hooks/use-imperative-dialog";
import useNotification from "../../../hooks/use-notification";
import useToggleState from "../../../hooks/use-toggle-state";
import { useFeatureFlag } from "../../../providers/feature-flag-provider";
import { isoAlpha2Countries } from "../../../utils/countries";
import { getErrorMessage } from "../../../utils/error-messages";
import extractCustomerName from "../../../utils/extract-customer-name";
import { formatAmountWithSymbol } from "../../../utils/prices";
import OrderEditProvider, { OrderEditContext } from "../edit/context";
import OrderEditModal from "../edit/modal";

import SummaryCard from "./detail-cards/summary";
import CreateFulfillmentModal from "./create-fulfillment";
import EmailModal from "./email-modal";
import MarkShippedModal from "./mark-shipped";
import {
  DisplayTotal,
  FormattedAddress,
  FormattedFulfillment,
  FulfillmentStatusComponent,
  OrderStatusComponent,
  PaymentStatusComponent,
} from "./templates";

type OrderDetailFulfillment = {
  title: string;
  type: string;
  fulfillment: Fulfillment;
  swap?: Swap;
  claim?: ClaimOrder;
};

const gatherAllFulfillments = (order) => {
  if (!order) {
    return [];
  }

  const all: OrderDetailFulfillment[] = [];

  order.fulfillments.forEach((f, index) => {
    all.push({
      title: `Fulfillment #${index + 1}`,
      type: "default",
      fulfillment: f,
    });
  });

  if (order.claims?.length) {
    order.claims.forEach((claim) => {
      if (claim.fulfillment_status !== "not_fulfilled") {
        claim.fulfillments.forEach((fulfillment, index) => {
          all.push({
            title: `Claim fulfillment #${index + 1}`,
            type: "claim",
            fulfillment,
            claim,
          });
        });
      }
    });
  }

  if (order.swaps?.length) {
    order.swaps.forEach((swap) => {
      if (swap.fulfillment_status !== "not_fulfilled") {
        swap.fulfillments.forEach((fulfillment, index) => {
          all.push({
            title: `Swap fulfillment #${index + 1}`,
            type: "swap",
            fulfillment,
            swap,
          });
        });
      }
    });
  }

  return all;
};

const OrderDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const dialog = useImperativeDialog();
  const [emailModal, setEmailModal] = useState<null | {
    email: string;
  }>(null);

  const { state: showTransferOrderModal, toggle: toggleTransferOrderModal } =
    useToggleState();

  const [showFulfillment, setShowFulfillment] = useState(false);
  const [fullfilmentToShip, setFullfilmentToShip] = useState(null);

  const { order, isLoading } = useAdminOrder(id!, {
    expand:
      "customer,billing_address,shipping_address,discounts,discounts.rule,shipping_methods,shipping_methods.shipping_option,payments,items,fulfillments,fulfillments.tracking_links,returns,returns.shipping_method,returns.shipping_method.shipping_option,returns.shipping_method.tax_lines,refunds,claims.claim_items.item,claims.fulfillments,claims.return_order,claims.additional_items.variant.product.profiles,swaps.return_order,swaps.additional_items.variant.product.profiles,swaps.fulfillments,returnable_items,edits,items.variant.product.store",
  });
  const cancelOrder = useAdminCancelOrder(id!);

  const { isFeatureEnabled } = useFeatureFlag();
  const inventoryEnabled = useMemo(() => {
    return isFeatureEnabled("inventoryService");
  }, [isFeatureEnabled]);

  const { reservations, refetch: refetchReservations } = useAdminReservations(
    {
      line_item_id: order?.items.map((item) => item.id),
    },
    {
      enabled: inventoryEnabled,
    }
  );

  useEffect(() => {
    if (inventoryEnabled) {
      refetchReservations();
    }
  }, [inventoryEnabled, refetchReservations]);

  const navigate = useNavigate();
  const notification = useNotification();

  const [, handleCopy] = useClipboard(`${order?.display_id!}`, {
    successDuration: 5500,
    onCopied: () =>
      notification(
        t("details-success", "Success"),
        t("details-order-id-copied", "Order ID copied"),
        "success"
      ),
  });

  const [, handleCopyEmail] = useClipboard(order?.email!, {
    successDuration: 5500,
    onCopied: () =>
      notification(
        t("details-success", "Success"),
        t("details-email-copied", "Email copied"),
        "success"
      ),
  });

  // @ts-ignore
  useHotkeys("esc", () => navigate("/a/orders"));
  useHotkeys("command+i", handleCopy);

  const handleDeleteOrder = async () => {
    const shouldDelete = await dialog({
      heading: t("details-cancel-order-heading", "Cancel order"),
      text: t(
        "details-are-you-sure-you-want-to-cancel-the-order",
        "Are you sure you want to cancel the order?"
      ),
      extraConfirmation: true,
      entityName: t("order-details-display-id", "order #{{display_id}}", {
        display_id: order.display_id,
      }),
    });

    if (!shouldDelete) {
      return;
    }

    return cancelOrder.mutate(undefined, {
      onSuccess: () =>
        notification(
          t("details-success", "Success"),
          t(
            "details-successfully-canceled-order",
            "Successfully canceled order"
          ),
          "success"
        ),
      onError: (err) =>
        notification(
          t("details-error", "Error"),
          getErrorMessage(err),
          "error"
        ),
    });
  };

  const allFulfillments = gatherAllFulfillments(order);

  if (!order && isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner size="small" variant="secondary" />
      </div>
    );
  }

  if (!order && !isLoading) {
    navigate("/404");
  }

  const anyItemsToFulfil = order.items.some(
    (item: LineItem) => item.quantity > (item.fulfilled_quantity ?? 0)
  );

  return (
    <div>
      <OrderEditProvider orderId={id!}>
        <BackButton
          path="/a/orders"
          label={t("details-back-to-orders", "Back to Orders")}
          className="mb-xsmall"
        />
        {isLoading || !order ? (
          <BodyCard className="pt-2xlarge flex w-full items-center justify-center">
            <Spinner size={"large"} variant={"secondary"} />
          </BodyCard>
        ) : (
          <>
            <div></div>
            <div className="flex space-x-4">
              <div className="gap-y-base flex h-full w-7/12 flex-col">
                <BodyCard
                  className={"min-h-[200px] w-full"}
                  customHeader={
                    <Tooltip side="top" content={"Copy ID"}>
                      <button
                        className="inter-xlarge-semibold text-grey-90 active:text-violet-90 flex cursor-pointer items-center gap-x-2"
                        onClick={handleCopy}
                      >
                        #{order.display_id} <ClipboardCopyIcon size={16} />
                      </button>
                    </Tooltip>
                  }
                  subtitle={moment(order.created_at).format(
                    "D MMMM YYYY hh:mm a"
                  )}
                  status={<OrderStatusComponent status={order.status} />}
                  forceDropdown={true}
                  actionables={[
                    {
                      label: t("details-cancel-order", "Cancel Order"),
                      icon: <CancelIcon size={"20"} />,
                      variant: "danger",
                      onClick: () => handleDeleteOrder(),
                    },
                  ]}
                >
                  <div className="mt-6 flex space-x-6 divide-x">
                    <div className="flex flex-col">
                      <div className="inter-smaller-regular text-grey-50 mb-1">
                        {t("details-email", "Email")}
                      </div>
                      <button
                        className="text-grey-90 active:text-violet-90 flex cursor-pointer items-center gap-x-1"
                        onClick={handleCopyEmail}
                      >
                        {order.email}
                        <ClipboardCopyIcon size={12} />
                      </button>
                    </div>
                    <div className="flex flex-col pl-6">
                      <div className="inter-smaller-regular text-grey-50 mb-1">
                        {t("details-phone", "Phone")}
                      </div>
                      <div>{order.shipping_address?.phone || "N/A"}</div>
                    </div>
                  </div>
                </BodyCard>
                <SummaryCard order={order} reservations={reservations || []} />
                <BodyCard
                  className={"h-auto min-h-0 w-full"}
                  title={t("details-payment", "Payment")}
                  status={
                    <PaymentStatusComponent status={order.payment_status} />
                  }
                >
                  <div>
                    {order.payments.map((payment) => (
                      <div className="flex flex-col" key={payment.id}>
                        <DisplayTotal
                          currency={order.currency_code}
                          totalAmount={payment.amount}
                          totalTitle={payment.provider_id}
                          subtitle={`${moment(payment.created_at).format(
                            "DD MMM YYYY hh:mm"
                          )}`}
                        />
                        {!!payment.amount_refunded && (
                          <div className="mt-4 flex justify-between">
                            <div className="flex">
                              <div className="text-grey-40 mr-2">
                                <CornerDownRightIcon />
                              </div>
                              <div className="inter-small-regular text-grey-90">
                                {t("details-refunded", "Refunded")}
                              </div>
                            </div>
                            <div className="flex">
                              <div className="inter-small-regular text-grey-90 mr-3">
                                -
                                {formatAmountWithSymbol({
                                  amount: payment.amount_refunded,
                                  currency: order.currency_code,
                                })}
                              </div>
                              <div className="inter-small-regular text-grey-50">
                                {order.currency_code.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </BodyCard>
                <BodyCard
                  className={"h-auto min-h-0 w-full"}
                  title={t("details-fulfillment", "Fulfillment")}
                  status={
                    <FulfillmentStatusComponent
                      status={order.fulfillment_status}
                    />
                  }
                  customActionable={
                    order.status !== "canceled" &&
                    anyItemsToFulfil && (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setShowFulfillment(true)}
                      >
                        {t("details-create-fulfillment", "Create Fulfillment")}
                      </Button>
                    )
                  }
                >
                  <div>
                    {order.shipping_methods.map((method) => (
                      <div className="flex flex-col" key={method.id}>
                        <span className="inter-small-regular text-grey-50">
                          {t("details-shipping-method", "Shipping Method")}
                        </span>
                        <span className="inter-small-regular text-grey-90 mt-2">
                          {method?.shipping_option?.name || ""}
                        </span>
                      </div>
                    ))}
                    <div className="inter-small-regular mt-6 ">
                      {allFulfillments.map((fulfillmentObj, i) => (
                        <FormattedFulfillment
                          key={i}
                          order={order}
                          fulfillmentObj={fulfillmentObj}
                          setFullfilmentToShip={setFullfilmentToShip}
                        />
                      ))}
                    </div>
                  </div>
                </BodyCard>
                <BodyCard
                  className={"h-auto min-h-0 w-full"}
                  title={t("details-customer", "Customer")}
                >
                  <div className="mt-6">
                    <div className="flex w-full items-center space-x-4">
                      <div className="flex h-[40px] w-[40px] ">
                        <Avatar
                          user={order.customer}
                          font="inter-large-semibold"
                          color="bg-fuschia-40"
                        />
                      </div>
                      <div>
                        <h1 className="inter-large-semibold text-grey-90">
                          {extractCustomerName(order)}
                        </h1>
                        {order.shipping_address && (
                          <span className="inter-small-regular text-grey-50">
                            {order.shipping_address.city},{" "}
                            {
                              isoAlpha2Countries[
                                order.shipping_address.country_code?.toUpperCase()
                              ]
                            }
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-6 divide-x">
                      <div className="flex flex-col">
                        <div className="inter-small-regular text-grey-50 mb-1">
                          {t("details-contact", "Contact")}
                        </div>
                        <div className="inter-small-regular flex flex-col">
                          <span>{order.email}</span>
                          <span>{order.shipping_address?.phone || ""}</span>
                        </div>
                      </div>
                      <FormattedAddress
                        title={t("details-shipping", "Shipping")}
                        addr={order.shipping_address}
                      />
                      <FormattedAddress
                        title={t("details-billing", "Billing")}
                        addr={order.billing_address}
                      />
                    </div>
                  </div>
                </BodyCard>
                <Spacer />
              </div>
              <Timeline orderId={order.id} />
            </div>
            {emailModal && (
              <EmailModal
                handleClose={() => setEmailModal(null)}
                email={emailModal.email}
                orderId={order.id}
              />
            )}
            {showFulfillment && (
              <CreateFulfillmentModal
                orderToFulfill={order as any}
                handleCancel={() => setShowFulfillment(false)}
                orderId={order.id}
                onComplete={inventoryEnabled ? refetchReservations : () => {}}
              />
            )}
            {showTransferOrderModal && (
              <TransferOrdersModal
                order={order}
                onDismiss={toggleTransferOrderModal}
              />
            )}
            {fullfilmentToShip && (
              <MarkShippedModal
                handleCancel={() => setFullfilmentToShip(null)}
                fulfillment={fullfilmentToShip}
                orderId={order.id}
              />
            )}
            <OrderEditContext.Consumer>
              {({ isModalVisible }) =>
                isModalVisible && <OrderEditModal order={order} />
              }
            </OrderEditContext.Consumer>
          </>
        )}
      </OrderEditProvider>
    </div>
  );
};

export default OrderDetails;
