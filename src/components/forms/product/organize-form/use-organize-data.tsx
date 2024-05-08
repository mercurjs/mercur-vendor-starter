import { useMemo } from 'react';
import { useAdminCollections, useAdminProductTypes } from 'medusa-react';

import useProductCategoriesOptions from '../../../../hooks/use-product-categories-options';

const useOrganizeData = () => {
  const { product_types } = useAdminProductTypes(undefined, {
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
  const { collections } = useAdminCollections();
  const categoriesOptions = useProductCategoriesOptions();

  const productTypeOptions = useMemo(() => {
    return (
      product_types?.map(({ id, value }) => ({
        value: id,
        label: value,
      })) || []
    );
  }, [product_types]);

  const collectionOptions = useMemo(() => {
    return (
      collections?.map(({ id, title }) => ({
        value: id,
        label: title,
      })) || []
    );
  }, [collections]);

  return {
    productTypeOptions,
    collectionOptions,
    categoriesOptions,
  };
};

export default useOrganizeData;
