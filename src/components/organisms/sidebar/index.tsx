import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminStore } from "medusa-react";

import CartIcon from "../../fundamentals/icons/cart-icon";
import GearIcon from "../../fundamentals/icons/gear-icon";
import TagIcon from "../../fundamentals/icons/tag-icon";
import SidebarMenuItem from "../../molecules/sidebar-menu-item";
import UserMenu from "../../molecules/user-menu";

const ICON_SIZE = 20;

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const [currentlyOpen, setCurrentlyOpen] = useState(-1);

  const { store } = useAdminStore();

  const triggerHandler = () => {
    const id = triggerHandler.id++;
    return {
      open: currentlyOpen === id,
      handleTriggerClick: () => setCurrentlyOpen(id),
    };
  };
  // We store the `id` counter on the function object, as a state creates
  // infinite updates, and we do not want the variable to be free floating.
  triggerHandler.id = 0;

  return (
    <div className="pb-[120px] small:pb-0 border-b  small:min-w-sidebar small:max-w-sidebar small:h-screen bg-gray-0 border-grey-20 py-base px-base overflow-y-auto small:border-r relative">
      <div className="h-full">
        <div className="flex justify-between px-2">
          <div className="rounded-circle flex h-8 w-8 items-center justify-center border border-solid border-gray-300">
            <UserMenu />
          </div>
        </div>
        <div className="my-base flex flex-col px-2">
          <span className="text-grey-50 text-small font-medium">
            {t("sidebar-store", "Store")}
          </span>
          <span className="text-grey-90 text-medium font-medium">
            {store?.name}
          </span>
        </div>
        <div className="py-3.5 flex small:flex-col absolute small:static top-0 right-4 gap-2">
          <SidebarMenuItem
            pageLink={"/a/orders"}
            icon={<CartIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={t("sidebar-orders", "Orders")}
          />
          <SidebarMenuItem
            pageLink={"/a/products"}
            icon={<TagIcon size={ICON_SIZE} />}
            text={t("sidebar-products", "Products")}
            triggerHandler={triggerHandler}
          />
          <SidebarMenuItem
            pageLink={"/a/settings"}
            icon={<GearIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={t("sidebar-settings", "Settings")}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
