import { Response } from '@medusajs/medusa-js';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

import client from '../../../services/api';
import { ProductStatus } from '../../../types/api';
import { queryKeys } from '../../../utils/query-keys';

type AdminProductsBulkEditReq = {
  status: ProductStatus;
  products: string[];
};

export const useAdminBulkEditProducts = (
  options?: UseMutationOptions<Response<void>, Error, AdminProductsBulkEditReq>,
) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: AdminProductsBulkEditReq) => {
      const response = await client.bulkEdit.products(payload);
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
