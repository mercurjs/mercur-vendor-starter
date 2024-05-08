import { Controller, useFieldArray, useWatch } from "react-hook-form";

import { NestedForm } from "../../../../utils/nested-form";
import { ShippingOption } from "@medusajs/medusa";
import {
  useAdminGetSession,
  useAdminRegion,
  useAdminStore,
} from "medusa-react";
import Checkbox from "../../../atoms/checkbox";
import { stringDisplayPrice } from "../../../../utils/prices";

export type ShippingFormType = {
  shipping_options: string[] | null;
};

type Props = {
  form: NestedForm<ShippingFormType>;
};

const ShippingForm = ({ form }: Props) => {
  const { control, path, getValues } = form;

  const currentFields = getValues(path("shipping_options"));
  const watchedFields = useWatch({ name: path("shipping_options"), control });

  const { insert, remove } = useFieldArray({
    control,
    // @ts-ignore
    name: path("shipping_options"),
  });

  const handleChange = (option: string, checked: boolean, index: number) => {
    const isOptionAlreadySelected = watchedFields?.includes(option);

    if (checked && !isOptionAlreadySelected) {
      insert(index + 1, option);
    } else if (!checked && isOptionAlreadySelected) {
      const optionIndex = watchedFields?.findIndex((el) => el === option);
      remove(optionIndex);
    }
  };

  const { user } = useAdminGetSession();
  // @ts-ignore
  const { store } = user?.store_id && useAdminStore(user?.store_id);
  const { shipping_options } = store;

  return (
    shipping_options &&
    shipping_options.map((option: ShippingOption, index: number) => {
      const optionId = option.id;
      const { region } = useAdminRegion(option.region_id);

      return (
        <Controller
          key={index}
          name={path(`shipping_options`)}
          control={control}
          render={() => {
            const formattedPrice = stringDisplayPrice({
              amount: option.amount,
              currencyCode: region?.currency_code,
            });

            return (
              <div className="flex items-center gap-1 py-2">
                <Checkbox
                  id={optionId}
                  label={`${option.name} - ${formattedPrice}`}
                  value={optionId}
                  onChange={(e) =>
                    handleChange(option.id, e.target.checked, index)
                  }
                  checked={!!currentFields?.find((el) => el === option.id)}
                />
              </div>
            );
          }}
        />
      );
    })
  );
};

export default ShippingForm;
