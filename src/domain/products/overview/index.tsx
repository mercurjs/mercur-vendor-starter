import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import Fade from "../../../components/atoms/fade-wrapper";
import Spacer from "../../../components/atoms/spacer";
import Button from "../../../components/fundamentals/button";
import PlusIcon from "../../../components/fundamentals/icons/plus-icon";
import BodyCard from "../../../components/organisms/body-card";
import ProductTable from "../../../components/templates/product-table";
import useToggleState from "../../../hooks/use-toggle-state";
import NewProduct from "../new";

const Overview = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const {
    state: createProductState,
    close: closeProductCreate,
    open: openProductCreate,
  } = useToggleState(location.search.includes("modal=new"));

  const [, setBulkSelectedIds] = useState<string[]>([]);

  const onBulkSelectionChange = useCallback((selectedIds: string[]) => {
    setBulkSelectedIds(selectedIds);
  }, []);

  const CurrentView = useCallback(() => {
    return <ProductTable onBulkSelectionChange={onBulkSelectionChange} />;
  }, []);

  const CurrentAction = () => {
    return (
      <div className="flex space-x-2">
        <Button variant="secondary" size="small" onClick={openProductCreate}>
          <PlusIcon size={20} />
          {t("overview-new-product", "New Product")}
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="gap-y-xsmall flex h-full grow flex-col">
        <div className="flex w-full grow flex-col">
          <BodyCard
            forceDropdown={false}
            customActionable={CurrentAction()}
            customHeader={
              <p className="text-large font-semibold">
                {t("sidebar-products", "Products")}
              </p>
            }
            className="h-fit"
          >
            <CurrentView />
          </BodyCard>
          <Spacer />
        </div>
      </div>
      <Fade isVisible={createProductState} isFullScreen={true}>
        <NewProduct onClose={closeProductCreate} />
      </Fade>
    </>
  );
};

export default Overview;
