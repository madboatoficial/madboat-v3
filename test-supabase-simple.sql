-- Teste simples para verificar se o Supabase aceita login
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se o usuário pode fazer login (sem RLS)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Verificar se as credenciais estão corretas
SELECT
  u.email,
  u.encrypted_password IS NOT NULL as has_password,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  u.aud,
  u.role,
  u.created_at
FROM auth.users u
WHERE u.email = 'sandro@madboat.com';

-- 3. Verificar se o profile existe e está acessível
SELECT
  p.email,
  p.full_name,
  p.status,
  p.onboarding_completed
FROM public.profiles p
WHERE p.email = 'sandro@madboat.com';

-- 4. Re-habilitar RLS depois do teste
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;