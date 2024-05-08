import { User } from '@medusajs/medusa';
import { useQuery } from '@tanstack/react-query';

import client from '../../../services/api';
import { queryKeys } from '../../../utils/query-keys';

type AdminUsersResponse = {
  users: User[];
  count: number;
  offset: number;
  limit: number;
};

type AdminUsersParams = {
  offset?: number;
  limit?: number;
  q?: string;
  role?: string[];
  status?: string[];
};

export const useAdminUsers = (params?: AdminUsersParams) => {
  const { data, ...other } = useQuery(
    [queryKeys.adminUsers, params],
    async () => {
      const res = await client.users.list(params);
      return res.data as AdminUsersResponse;
    },
    {
      keepPreviousData: true,
    },
  );

  return { ...data, ...other } as const;
};
