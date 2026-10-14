-- Drivers order Smart Cards, pay through Paystack, and have them delivered in Accra or pick them up.

-- The card tiers on sale. Staff set names, descriptions and prices; a card with no price is not offered.
CREATE TABLE IF NOT EXISTS motorambos.card_products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    design text NOT NULL CHECK (design IN ('white-waves', 'white-marble', 'black')),
    price_pesewas integer CHECK (price_pesewas IS NULL OR price_pesewas > 0),
    active boolean NOT NULL DEFAULT false,
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO motorambos.card_products (name, description, design, sort_order)
SELECT name, description, design, sort_order FROM (VALUES
    ('White', 'Smart Card in white with blue waves.', 'white-waves', 1),
    ('White', 'Smart Card in white with blue marble.', 'white-marble', 2),
    ('Black Premium', 'Premium Smart Card in black.', 'black', 3)
) AS seed(name, description, design, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM motorambos.card_products);

-- One row of delivery and pickup settings.
CREATE TABLE IF NOT EXISTS motorambos.card_order_settings (
    id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    delivery_enabled boolean NOT NULL DEFAULT true,
    delivery_fee_pesewas integer CHECK (delivery_fee_pesewas IS NULL OR delivery_fee_pesewas >= 0),
    pickup_enabled boolean NOT NULL DEFAULT true,
    pickup_address text,
    updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO motorambos.card_order_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS motorambos.card_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number text NOT NULL UNIQUE,
    member_id uuid NOT NULL REFERENCES motorambos.members(id),
    vehicle_id uuid REFERENCES motorambos.vehicles(id) ON DELETE SET NULL,
    product_id uuid NOT NULL REFERENCES motorambos.card_products(id),
    product_name text NOT NULL,
    product_design text NOT NULL,
    unit_price_pesewas integer NOT NULL CHECK (unit_price_pesewas > 0),
    delivery_method text NOT NULL CHECK (delivery_method IN ('delivery', 'pickup')),
    delivery_fee_pesewas integer NOT NULL DEFAULT 0 CHECK (delivery_fee_pesewas >= 0),
    total_pesewas integer NOT NULL CHECK (total_pesewas > 0),
    recipient_name text NOT NULL,
    recipient_phone text NOT NULL,
    area text,
    address text,
    notes text,
    status text NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'paid', 'processing', 'out_for_delivery', 'ready_for_pickup', 'delivered', 'cancelled')),
    paystack_reference text UNIQUE,
    paid_at timestamptz,
    card_serial text,
    staff_note text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS card_orders_member_idx ON motorambos.card_orders(member_id, created_at DESC);
CREATE INDEX IF NOT EXISTS card_orders_status_idx ON motorambos.card_orders(status, created_at DESC);

ALTER TABLE motorambos.card_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorambos.card_order_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorambos.card_orders ENABLE ROW LEVEL SECURITY;

-- Only server routes, which check the signed-in member or staff first, use these tables.
REVOKE ALL ON motorambos.card_products, motorambos.card_order_settings, motorambos.card_orders FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON motorambos.card_products, motorambos.card_order_settings, motorambos.card_orders TO service_role;
