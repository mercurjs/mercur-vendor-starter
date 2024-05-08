import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, FocusModal, Heading, Input, Select, Text } from "@medusajs/ui";
import { useAdminCreateInvite } from "medusa-react";

import useNotification from "../../../hooks/use-notification";
import { UserRoles } from "../../../types/api";
import { getErrorMessage } from "../../../utils/error-messages";
import InputHeader from "../../fundamentals/input-header";

type UsersInviteModalProps = {
  onClose: () => void;
  state: boolean;
};

type UsersInviteModalFormData = {
  user: string;
  role: UserRoles;
};

const roles = [
  { label: "Admin", value: UserRoles.ADMIN },
  { label: "Member", value: UserRoles.MEMBER },
];

const UsersInviteModal: React.FC<UsersInviteModalProps> = ({
  onClose,
  state,
}) => {
  const { mutateAsync } = useAdminCreateInvite();
  const form = useForm<UsersInviteModalFormData>({
    defaultValues: {
      user: "",
      role: UserRoles.MEMBER,
    },
  });
  const { register, handleSubmit } = form;

  const notification = useNotification();

  const submit = (data: UsersInviteModalFormData) => {
    mutateAsync(data, {
      onSuccess: () => {
        notification("Success", `Invite sent to ${data.user}`, "success");
        onClose();
      },
      onError: (err) => notification("Error", getErrorMessage(err), "error"),
    });
  };

  return (
    <FocusModal open={state} onOpenChange={onClose}>
      <FocusModal.Content>
        <form onSubmit={handleSubmit(submit)}>
          <FocusModal.Header>
            <Button>Invite user</Button>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center px-4 py-6">
            <div className="flex w-full max-w-lg flex-col gap-y-4">
              <div className="flex flex-col gap-y-1">
                <Heading> Invite user to the team</Heading>
                <Text className="text-ui-fg-subtle">
                  Invite a user to your team by entering their email address
                </Text>
              </div>
              <div className="flex flex-col gap-y-2">
                <InputHeader label="E-mail" />
                <Input
                  placeholder={"example@example.com"}
                  {...register("user", { required: true })}
                />
                {form.formState.errors.user && (
                  <Text className="text-ui-fg-error">
                    This field is required
                  </Text>
                )}
              </div>
              <div className="flex flex-col gap-y-2">
                <InputHeader label="Role" />
                <Controller
                  name={"role"}
                  control={form.control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Select value={value} onValueChange={onChange}>
                        <Select.Trigger>
                          <Select.Value placeholder="Placeholder" />
                        </Select.Trigger>
                        <Select.Content>
                          {roles.map((item) => (
                            <Select.Item key={item.value} value={item.value}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    );
                  }}
                />
              </div>
            </div>
          </FocusModal.Body>
        </form>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default UsersInviteModal;
