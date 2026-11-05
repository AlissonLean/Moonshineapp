-- ==============================================================================
-- SCRIPT DE BASE DE DATOS PARA MOONSHINE KAIZEN EN SUPABASE
-- ==============================================================================
-- Instrucciones:
-- 1. Inicia sesión en tu cuenta de Supabase (https://supabase.com)
-- 2. Entra a tu proyecto
-- 3. Ve al menú lateral izquierdo -> "SQL Editor"
-- 4. Haz clic en "New Query"
-- 5. Pega todo este código y haz clic en "Run" (ejecutar)
-- ==============================================================================

-- 1. Crear tabla para el estado unificado de la aplicación Moonshine
create table if not exists moonshine_state (
  id text primary key default 'current_state',
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Habilitar Seguridad a Nivel de Fila (Row Level Security - RLS)
alter table moonshine_state enable row level security;

-- 3. Eliminar políticas previas si existían
drop policy if exists "Permitir lectura publica moonshine" on moonshine_state;
drop policy if exists "Permitir insercion publica moonshine" on moonshine_state;
drop policy if exists "Permitir actualizacion publica moonshine" on moonshine_state;

-- 4. Crear políticas públicas para permitir lectura, inserción y actualización con anon key
create policy "Permitir lectura publica moonshine" 
on moonshine_state for select 
using (true);

create policy "Permitir insercion publica moonshine" 
on moonshine_state for insert 
with check (true);

create policy "Permitir actualizacion publica moonshine" 
on moonshine_state for update 
using (true) 
with check (true);

-- 5. Habilitar Tiempo Real (Supabase Realtime)
-- Permite que si un operador registra producción, se actualice en la pantalla del administrador en vivo
alter publication supabase_realtime add table moonshine_state;

-- 6. Opcional: Tabla de historial de auditoría o respaldos manuales
create table if not exists moonshine_backups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by text default 'Administrador',
  data jsonb not null
);

alter table moonshine_backups enable row level security;

create policy "Permitir insercion de respaldos" 
on moonshine_backups for insert 
with check (true);

create policy "Permitir lectura de respaldos" 
on moonshine_backups for select 
using (true);
