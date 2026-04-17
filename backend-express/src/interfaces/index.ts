import {
  Tenant,
  User,
  Role,
  UserRole,
  ProductCategory,
  StorageLocation,
  Product,
  InventoryItem,
  InventoryMovement,
  Maintenance,
  Customer,
  Rental,
  RentalItem,
} from '@prisma/client';

export type {
  Tenant,
  User,
  Role,
  UserRole,
  ProductCategory,
  StorageLocation,
  Product,
  InventoryItem,
  InventoryMovement,
  Maintenance,
  Customer,
  Rental,
  RentalItem,
};

export type Category = ProductCategory;
export type LocationInfo = StorageLocation;