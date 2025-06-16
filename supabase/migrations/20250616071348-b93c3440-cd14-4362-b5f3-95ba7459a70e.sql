
-- Update the user to have admin role and enterprise subscription
UPDATE profiles 
SET role = 'admin', user_type = 'company', organization_name = 'Shoale Admin'
WHERE email = 'craigfubara@yahoo.co.uk';

-- Get the enterprise plan ID and update their subscription
UPDATE subscriptions 
SET plan_id = (SELECT id FROM subscription_plans WHERE tier = 'enterprise' LIMIT 1),
    status = 'active',
    end_date = NOW() + INTERVAL '1 year'
WHERE user_id = (SELECT id FROM profiles WHERE email = 'craigfubara@yahoo.co.uk');

-- Update their security settings to high level
UPDATE security_settings 
SET security_level = 'very-high',
    min_confidence_threshold = 85,
    anomaly_detection_sensitivity = 90
WHERE user_id = (SELECT id FROM profiles WHERE email = 'craigfubara@yahoo.co.uk');
