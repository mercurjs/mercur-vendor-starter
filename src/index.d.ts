/// <reference types="vite/client" />

import { ProductCategory } from '@medusajs/medusa';

export declare module '@medusajs/medusa/dist/models/user' {
  declare type UserStatus = 'active' | 'pending' | 'rejected';

  declare interface User {
    status: UserStatus;
    is_trusted: boolean;
    store_id?: string;
  }

  declare enum UserRoles {
    ADMIN = 'admin',
    MEMBER = 'member',
    DEVELOPER = 'developer',
    VENDOR = 'vendor',
  }
}

export declare module '@medusajs/medusa/dist/models/product-tag' {
  declare interface ProductTag {
    categories: ProductCategory[];
  }
}
