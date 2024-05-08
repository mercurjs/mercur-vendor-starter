import { useNavigate } from 'react-router-dom';
import {
  AdminPostProductsProductReq,
  AdminPostProductsProductVariantsReq,
  AdminPostProductsProductVariantsVariantReq,
  Product,
} from '@medusajs/medusa';
import { useQueryClient } from '@tanstack/react-query';
import {
  adminInventoryItemsKeys,
  useAdminCreateVariant,
  useAdminDeleteProduct,
  useAdminDeleteVariant,
  useAdminProduct,
  useAdminUpdateProduct,
  useAdminUpdateVariant,
  useMedusa,
} from 'medusa-react';

import { useFeatureFlag } from '../providers/feature-flag-provider';
import { getErrorMessage } from '../utils/error-messages';

import useImperativeDialog from './use-imperative-dialog';
import useNotification from './use-notification';

const useEditProductActions = (productId: string) => {
  const dialog = useImperativeDialog();
  const navigate = useNavigate();
  const notification = useNotification();
  const getProduct = useAdminProduct(productId);
  const updateProduct = useAdminUpdateProduct(productId);
  const deleteProduct = useAdminDeleteProduct(productId);
  const updateVariant = useAdminUpdateVariant(productId);
  const deleteVariant = useAdminDeleteVariant(productId);
  const addVariant = useAdminCreateVariant(productId);
  const queryClient = useQueryClient();
  const { isFeatureEnabled } = useFeatureFlag();
  const { client } = useMedusa();

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: 'Delete Product',
      text: 'Are you sure you want to delete this product',
    });

    if (shouldDelete) {
      if (isFeatureEnabled('inventoryService') && getProduct.product) {
        const { variants } = await client.admin.variants.list({
          id: getProduct.product.variants.map(v => v.id),
          expand: 'inventory_items',
        });

        variants
          .filter(({ inventory_items }) => !!inventory_items?.length)
          .map(({ inventory_items }) =>
            client.admin.inventoryItems.delete(
              inventory_items![0].inventory_item_id,
            ),
          );
        queryClient.invalidateQueries(adminInventoryItemsKeys.lists());
      }

      deleteProduct.mutate(undefined, {
        onSuccess: () => {
          notification('Success', 'Product deleted successfully', 'success');
          navigate('/a/products/');
        },
        onError: err => {
          notification('Error', getErrorMessage(err), 'error');
        },
      });
    }
  };

  const onAddVariant = (
    payload: AdminPostProductsProductVariantsReq,
    onSuccess: (variantRes: Product) => void,
    successMessage = 'Variant was created successfully',
  ) => {
    addVariant.mutate(payload, {
      onSuccess: data => {
        notification('Success', successMessage, 'success');
        getProduct.refetch();
        onSuccess(data.product);
      },
      onError: err => {
        notification('Error', getErrorMessage(err), 'error');
      },
    });
  };

  const onUpdateVariant = (
    id: string,
    payload: Partial<AdminPostProductsProductVariantsVariantReq>,
    onSuccess: () => void,
    successMessage = 'Variant was updated successfully',
  ) => {
    updateVariant.mutate(
      {
        variant_id: id,
        ...payload,
      },
      {
        onSuccess: () => {
          notification('Success', successMessage, 'success');
          getProduct.refetch();
          onSuccess();
        },
        onError: err => {
          notification('Error', getErrorMessage(err), 'error');
        },
      },
    );
  };

  const onDeleteVariant = (
    variantId: string,
    onSuccess?: () => void,
    successMessage = 'Variant was successfully deleted',
  ) => {
    deleteVariant.mutate(variantId, {
      onSuccess: () => {
        notification('Success', successMessage, 'success');
        getProduct.refetch();
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: err => {
        notification('Error', getErrorMessage(err), 'error');
      },
    });
  };

  const onUpdate = (
    payload: Partial<AdminPostProductsProductReq>,
    onSuccess: () => void,
    successMessage = 'Product was successfully updated',
  ) => {
    updateProduct.mutate(
      // @ts-ignore TODO fix images being required
      payload,
      {
        onSuccess: () => {
          notification('Success', successMessage, 'success');
          onSuccess();
        },
        onError: err => {
          notification('Error', getErrorMessage(err), 'error');
        },
      },
    );
  };

  const onStatusChange = (newStatus: string) => {
    updateProduct.mutate(
      {
        // @ts-ignore TODO fix update type in API
        status: newStatus,
      },
      {
        onSuccess: () => {
          notification('Success', 'Product updated successfully', 'success');
        },
        onError: err => {
          notification('Ooops', getErrorMessage(err), 'error');
        },
      },
    );
  };

  return {
    getProduct,
    onDelete,
    onStatusChange,
    onUpdate,
    onAddVariant,
    onUpdateVariant,
    onDeleteVariant,
    updating: updateProduct.isLoading,
    deleting: deleteProduct.isLoading,
    addingVariant: addVariant.isLoading,
    updatingVariant: updateVariant.isLoading,
    deletingVariant: deleteVariant.isLoading,
  };
};

export default useEditProductActions;
