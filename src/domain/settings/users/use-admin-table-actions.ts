import { usePrompt } from '@medusajs/ui';
import { useQueryClient } from '@tanstack/react-query';

import { ActionType } from '../../../components/molecules/actionables';
import useNotification from '../../../hooks/use-notification';
import { getErrorMessage } from '../../../utils/error-messages';
import { queryKeys } from '../../../utils/query-keys';

import { useAdminBulkEditUsers } from './use-admin-bulk-edit-users';

type UseAdminTableActionsProps = {
  users: string[];
  reset: () => void;
};

export const useAdminTableActions = ({
  users,
  reset,
}: UseAdminTableActionsProps): ActionType[] => {
  const dialog = usePrompt();
  const queryClient = useQueryClient();
  const { mutate: bulkUpdate } = useAdminBulkEditUsers({
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.adminUsers]);
      reset();
    },
  });
  const notification = useNotification();

  const handleReject = async () => {
    const shouldReject = await dialog({
      title: 'Reject users',
      description: 'Are you sure you want to reject this users',
    });

    if (shouldReject) {
      bulkUpdate(
        { status: 'rejected', users },
        {
          onSuccess: () => {
            notification('Success', 'Succesfully rejected users', 'success');
          },
          onError: err => {
            notification('Error', getErrorMessage(err), 'error');
          },
        },
      );
    }
  };

  const handleAccept = async () => {
    const shouldApprove = await dialog({
      title: 'Approve users',
      description: 'Are you sure you want to approve this users',
    });

    if (shouldApprove) {
      bulkUpdate(
        { status: 'active', users },
        {
          onSuccess: () => {
            notification('Success', 'Succesfully accepted users', 'success');
          },
          onError: err => {
            notification('Error', getErrorMessage(err), 'error');
          },
        },
      );
    }
  };

  return [
    { label: 'Approve', onClick: handleAccept },
    { label: 'Reject', onClick: handleReject, variant: 'danger' },
  ];
};
