-- Insert demo users directly into auth.users and profiles
-- Admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@etechjr.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Get the admin user ID to insert into profiles
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@etechjr.com';
    
    INSERT INTO public.profiles (id, email, full_name, role, department)
    VALUES (admin_user_id, 'admin@etechjr.com', 'Administrador do Sistema', 'admin', 'TI');
END $$;

-- Manager user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'manager@etechjr.com',
  crypt('manager123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Get the manager user ID to insert into profiles
DO $$
DECLARE
    manager_user_id uuid;
BEGIN
    SELECT id INTO manager_user_id FROM auth.users WHERE email = 'manager@etechjr.com';
    
    INSERT INTO public.profiles (id, email, full_name, role, department)
    VALUES (manager_user_id, 'manager@etechjr.com', 'Gerente de Vendas', 'manager', 'Vendas');
END $$;

-- Regular user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'user@etechjr.com',
  crypt('user123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Get the user ID to insert into profiles
DO $$
DECLARE
    regular_user_id uuid;
BEGIN
    SELECT id INTO regular_user_id FROM auth.users WHERE email = 'user@etechjr.com';
    
    INSERT INTO public.profiles (id, email, full_name, role, department)
    VALUES (regular_user_id, 'user@etechjr.com', 'Vendedor', 'user', 'Vendas');
END $$;