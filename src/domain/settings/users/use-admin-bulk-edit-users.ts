import { UserStatus } from '@medusajs/medusa';
import { Response } from '@medusajs/medusa-js';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

import client from '../../../services/api';
import { queryKeys } from '../../../utils/query-keys';

type AdminUsersBulkEditReq = {
  status: UserStatus;
  users: string[];
};

export const useAdminBulkEditUsers = (
  options?: UseMutationOptions<Response<void>, Error, AdminUsersBulkEditReq>,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: AdminUsersBulkEditReq) => {
      const response = await client.bulkEdit.users(payload);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryKeys.adminUsers]);
      },
      ...options,
    },
  );
};
