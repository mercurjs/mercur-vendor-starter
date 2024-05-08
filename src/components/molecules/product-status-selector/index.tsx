import React, { useMemo } from "react";
import { EllipseGreenSolid, EllipseGreySolid } from "@medusajs/icons";
import { ProductStatus } from "@medusajs/types";
import { Button, DropdownMenu } from "@medusajs/ui";

type ProductStatusSelectorProps = {
  value: ProductStatus;
  onChange: (newStatus: ProductStatus) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const options: {
  value: ProductStatus;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: ProductStatus.DRAFT,
    label: "Draft",
    icon: <EllipseGreySolid />,
  },
  {
    value: ProductStatus.PUBLISHED,
    label: "Published",
    icon: <EllipseGreenSolid />,
  },
];

const ProductStatusSelector: React.FC<ProductStatusSelectorProps> = ({
  onChange,
  value,
  ...rest
}) => {
  const currentStatus = useMemo(
    () => options.find((it) => it.value === value)!,
    [value]
  );

  return (
    <DropdownMenu {...rest}>
      <DropdownMenu.Trigger asChild>
        <Button variant="transparent">
          {currentStatus.icon}
          {currentStatus.label}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" side="bottom" className="min-w-[200px]">
        {options.map(({ value, label, icon }) => (
          <DropdownMenu.Item
            key={value}
            onClick={(e) => {
              e.stopPropagation();
              onChange(value);
            }}
          >
            {icon}
            {label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export default ProductStatusSelector;
