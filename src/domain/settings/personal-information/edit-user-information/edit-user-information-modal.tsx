import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { User } from "@medusajs/medusa";
import {
  useAdminGetSession,
  useAdminStore,
  useAdminUpdateStore,
  useAdminUpdateUser,
} from "medusa-react";

import Button from "../../../../components/fundamentals/button";
import InputField from "../../../../components/molecules/input";
import Modal from "../../../../components/molecules/modal";
import useNotification from "../../../../hooks/use-notification";
import TextArea from "../../../../components/molecules/textarea";
import { ExtendedStoreDTO } from "@medusajs/medusa/dist/types/store";

type Props = {
  user: Omit<User, "password_hash">;
  open: boolean;
  onClose: () => void;
};

type EditInformationFormType = {
  first_name: string | null;
  last_name: string | null;
  store_name: string;
  metadata?: {
    billing_info?: string | null;
  };
};

const EditUserInformationModal = ({ user, open, onClose }: Props) => {
  const { mutate, isLoading: isSubmitting } = useAdminUpdateUser(user.id);
  const { mutate: mutateStore } = useAdminUpdateStore();
  const { refetch } = useAdminGetSession();
  const { t } = useTranslation();

  // @ts-ignore
  const { store } = useAdminStore(user.store_id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditInformationFormType>({
    defaultValues: getDefaultValues(user, store),
  });

  useEffect(() => {
    reset(getDefaultValues(user, store));
  }, [open, user]);

  const notification = useNotification();

  const onSubmit = handleSubmit((data) => {
    Promise.all([
      mutateStore({
        name: data.store_name,
      }),
      mutate(
        {
          first_name: data?.first_name!,
          last_name: data?.last_name!,
          metadata: data.metadata,
        },
        {
          onSuccess: () => {
            refetch();
            onClose();
          },
          onError: () => {},
        }
      ),
    ]).then(() => {
      notification(
        t("edit-user-information-success", "Success"),
        t(
          "edit-user-information-your-information-was-successfully-updated",
          "Your information was successfully updated"
        ),
        "success"
      );
    });
  });

  return (
    <Modal handleClose={onClose} open={open} isLargeModal={false}>
      <Modal.Header handleClose={onClose}>
        <h1 className="inter-large-semibold large:inter-xlarge-semibold">
          {t("edit-user-information-edit-information", "Edit information")}
        </h1>
      </Modal.Header>
      <Modal.Body>
        <Modal.Content>
          <div className="px-2 large:p-0 gap-y-base flex flex-col">
            <InputField
              {...register("store_name")}
              errors={errors}
              label="Store name"
              required
            />
            <div className="gap-x-base grid grid-cols-1 gap-3 small:grid-cols-2">
              <InputField
                {...register("first_name")}
                errors={errors}
                label="First name"
              />
              <InputField
                {...register("last_name")}
                errors={errors}
                label="Last name"
              />
            </div>
            <TextArea
              {...register("metadata.billing_info")}
              errors={errors}
              label="Billing info"
              placeholder="Write information like address, NIP, bank account etc. (separate information with a comma)"
              className="w-full"
            />
          </div>
        </Modal.Content>
        <Modal.Footer className="border-grey-20 pt-base border-t">
          <div className="gap-x-xsmall flex w-full items-center justify-end">
            <Button variant="secondary" size="small" onClick={onClose}>
              {t("edit-user-information-cancel", "Cancel")}
            </Button>
            <Button
              variant="primary"
              size="small"
              loading={isSubmitting}
              disabled={isSubmitting}
              onClick={onSubmit}
            >
              {t("edit-user-information-submit-and-close", "Submit and close")}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

const getDefaultValues = (
  user: Omit<User, "password_hash">,
  store: ExtendedStoreDTO | undefined
) => {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    store_name: store?.name,
    metadata: user.metadata,
  };
};

export default EditUserInformationModal;
