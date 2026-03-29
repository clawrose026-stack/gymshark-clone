-- ============================================
-- ORDER MILESTONES MIGRATION
-- Run this in your Supabase SQL Editor
-- ============================================

-- Order milestones table for tracking order progress
CREATE TABLE IF NOT EXISTS order_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    milestone VARCHAR(30) NOT NULL,  -- 'placed', 'confirmed', 'processing', 'shipped', 'delivered'
    title VARCHAR(100) NOT NULL,
    description TEXT,
    reached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_milestones_order ON order_milestones(order_id);

-- Function to auto-create initial milestones when an order is marked as paid
CREATE OR REPLACE FUNCTION create_order_milestones()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
        -- Insert 'placed' and 'confirmed' milestones automatically
        INSERT INTO order_milestones (order_id, milestone, title, description)
        VALUES 
            (NEW.id, 'placed', 'Order Placed', 'Your order has been received'),
            (NEW.id, 'confirmed', 'Payment Confirmed', 'Payment has been verified successfully');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_create_milestones ON orders;
CREATE TRIGGER trigger_create_milestones
    AFTER UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION create_order_milestones();

-- ============================================
-- MANUAL MILESTONE ADVANCEMENT (run when needed)
-- ============================================
-- To advance an order to 'processing':
-- INSERT INTO order_milestones (order_id, milestone, title, description)
-- VALUES ('<order-uuid>', 'processing', 'Processing', 'Your order is being prepared');
--
-- To advance to 'shipped':
-- INSERT INTO order_milestones (order_id, milestone, title, description)
-- VALUES ('<order-uuid>', 'shipped', 'Shipped', 'Your order is on its way');
--
-- To advance to 'delivered':
-- INSERT INTO order_milestones (order_id, milestone, title, description)
-- VALUES ('<order-uuid>', 'delivered', 'Delivered', 'Your order has been delivered');
