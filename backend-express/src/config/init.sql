
-- ENUMS

CREATE TYPE "MovementType"      AS ENUM ('IN', 'OUT', 'TRANSFER');
CREATE TYPE "ItemStatus"        AS ENUM ('AVAILABLE', 'RENTED', 'MAINTENANCE', 'RETIRED');
CREATE TYPE "ItemTrackingType"  AS ENUM ('SERIALIZED', 'BULK');
CREATE TYPE "RentalStatus"      AS ENUM ('ACTIVE', 'PARTIAL_RETURN', 'RETURNED', 'CANCELLED');
CREATE TYPE "MaintenanceStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED');

-- 1. Tenants
CREATE TABLE tenants (
    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users
CREATE TABLE users (
    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id  UUID         NOT NULL,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants (id),
    CONSTRAINT uq_tenant_email UNIQUE (tenant_id, email)
);

-- 3. Roles
-- Valores: TENANT_ADMIN, SALES_AGENT, INVENTORY_MANAGER
CREATE TABLE roles (
    id   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 4. User ↔ Role (N:M)
CREATE TABLE user_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

-- 5. Categorías de Productos
CREATE TABLE product_categories (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID         NOT NULL,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    slug        VARCHAR(255) NOT NULL,
    CONSTRAINT fk_cat_tenant   FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT uq_tenant_slug  UNIQUE (tenant_id, slug)
);

-- 6. Ubicaciones de Almacenamiento
CREATE TABLE storage_locations (
    id        UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID         NOT NULL,
    name      VARCHAR(255) NOT NULL,
    address   TEXT,
    CONSTRAINT fk_loc_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id)
);

-- 7. Productos – catálogo
CREATE TABLE products (
    id             UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id      UUID               NOT NULL,
    name           VARCHAR(255)       NOT NULL,
    description    TEXT,
    category_id    UUID               NOT NULL,
    price_in_cents INT                NOT NULL,       -- RNF-06
    tracking_type  "ItemTrackingType" NOT NULL DEFAULT 'SERIALIZED',
    created_at     TIMESTAMPTZ        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prod_tenant   FOREIGN KEY (tenant_id)  REFERENCES tenants (id),
    CONSTRAINT fk_prod_category FOREIGN KEY (category_id) REFERENCES product_categories (id) ON DELETE RESTRICT
);

-- 8. Items de Inventario
CREATE TABLE inventory_items (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id     UUID         NOT NULL,
    product_id    UUID         NOT NULL,
    location_id   UUID         NOT NULL,
    serial_number VARCHAR(255),
    status        "ItemStatus" NOT NULL DEFAULT 'AVAILABLE',
    quantity      INT          NOT NULL DEFAULT 1,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_item_tenant   FOREIGN KEY (tenant_id)  REFERENCES tenants (id),
    CONSTRAINT fk_item_product  FOREIGN KEY (product_id)  REFERENCES products (id),
    CONSTRAINT fk_item_location FOREIGN KEY (location_id) REFERENCES storage_locations (id),
    CONSTRAINT uq_tenant_serial UNIQUE (tenant_id, serial_number),
    CONSTRAINT chk_item_qty     CHECK (quantity > 0)
);

-- 9. Movimientos de Inventario – auditoría
CREATE TABLE inventory_movements (
    id         UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id  UUID           NOT NULL,
    item_id    UUID           NOT NULL,
    quantity   INT            NOT NULL,
    type       "MovementType" NOT NULL,
    note       TEXT,
    created_at TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mov_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_mov_item   FOREIGN KEY (item_id)   REFERENCES inventory_items (id),
    CONSTRAINT chk_mov_qty   CHECK (quantity > 0)
);

-- 10. Mantenimientos
CREATE TABLE maintenances (
    id             UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id      UUID                NOT NULL,
    item_id        UUID                NOT NULL,
    description    TEXT                NOT NULL,
    scheduled_date TIMESTAMPTZ         NOT NULL,
    completed_date TIMESTAMPTZ,
    status         "MaintenanceStatus" NOT NULL DEFAULT 'SCHEDULED',
    created_at     TIMESTAMPTZ         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_maint_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_maint_item   FOREIGN KEY (item_id)   REFERENCES inventory_items (id)
);

-- 11. Clientes
CREATE TABLE customers (
    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id  UUID         NOT NULL,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    phone      VARCHAR(50),
    is_blocked BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cust_tenant       FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT uq_tenant_cust_email UNIQUE (tenant_id, email)
);

-- 12. Alquileres – cabecera
CREATE TABLE rentals (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id      UUID           NOT NULL,
    customer_id    UUID           NOT NULL,
    start_date     TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date       TIMESTAMPTZ    NOT NULL,
    status         "RentalStatus" NOT NULL DEFAULT 'ACTIVE',
    total_in_cents INT            NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rent_tenant   FOREIGN KEY (tenant_id)   REFERENCES tenants (id),
    CONSTRAINT fk_rent_customer FOREIGN KEY (customer_id)  REFERENCES customers (id) ON DELETE RESTRICT
);

-- 13. Items del Alquiler – detalle
CREATE TABLE rental_items (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    rental_id         UUID        NOT NULL,
    item_id           UUID        NOT NULL,
    quantity          INT         NOT NULL,
    price_in_cents    INT         NOT NULL,
    returned_quantity INT         NOT NULL DEFAULT 0,
    returned_at       TIMESTAMPTZ,
    CONSTRAINT fk_ri_rental FOREIGN KEY (rental_id) REFERENCES rentals (id) ON DELETE CASCADE,
    CONSTRAINT fk_ri_item   FOREIGN KEY (item_id)   REFERENCES inventory_items (id) ON DELETE RESTRICT,
    CONSTRAINT chk_ri_qty   CHECK (quantity > 0)
);

-- ÍNDICES
CREATE INDEX idx_users_tenant           ON users (tenant_id);
CREATE INDEX idx_categories_tenant      ON product_categories (tenant_id);
CREATE INDEX idx_locations_tenant       ON storage_locations (tenant_id);
CREATE INDEX idx_products_tenant        ON products (tenant_id);
CREATE INDEX idx_products_category      ON products (category_id);
CREATE INDEX idx_items_tenant           ON inventory_items (tenant_id);
CREATE INDEX idx_items_product          ON inventory_items (product_id);
CREATE INDEX idx_items_location         ON inventory_items (location_id);
CREATE INDEX idx_movements_tenant       ON inventory_movements (tenant_id);
CREATE INDEX idx_movements_item         ON inventory_movements (item_id);
CREATE INDEX idx_maintenances_tenant    ON maintenances (tenant_id);
CREATE INDEX idx_maintenances_item      ON maintenances (item_id);
CREATE INDEX idx_customers_tenant       ON customers (tenant_id);
CREATE INDEX idx_rentals_tenant         ON rentals (tenant_id);
CREATE INDEX idx_rentals_customer       ON rentals (customer_id);
CREATE INDEX idx_rentalitems_rental     ON rental_items (rental_id);
CREATE INDEX idx_rentalitems_item       ON rental_items (item_id);

-- Roles
INSERT INTO roles (name) VALUES
    ('TENANT_ADMIN'),
    ('SALES_AGENT'),
    ('INVENTORY_MANAGER')
ON CONFLICT (name) DO NOTHING;