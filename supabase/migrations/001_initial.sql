-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Categories
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        varchar(50)  not null,
  slug        varchar(50)  not null unique,
  description varchar(200),
  position    integer      not null default 0,
  created_at  timestamptz  not null default now()
);

create index idx_categories_slug     on categories (slug);
create index idx_categories_position on categories (position);

-- Menu items
create table if not exists menu_items (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid         not null references categories(id) on delete cascade,
  name         varchar(100) not null,
  description  varchar(500) not null,
  price        numeric(8,2) not null check (price > 0),
  image_url    varchar(500),
  is_available boolean      not null default true,
  is_featured  boolean      not null default false,
  extras       jsonb,
  position     integer      not null default 0,
  created_at   timestamptz  not null default now(),
  updated_at   timestamptz  not null default now()
);

create index idx_menu_items_category    on menu_items (category_id);
create index idx_menu_items_available   on menu_items (is_available);
create index idx_menu_items_featured    on menu_items (is_featured);
create index idx_menu_items_position    on menu_items (position);

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger menu_items_updated_at
  before update on menu_items
  for each row execute procedure set_updated_at();

-- Row Level Security
alter table categories  enable row level security;
alter table menu_items  enable row level security;

-- Public can read available items and all categories
create policy "Public read categories"
  on categories for select using (true);

create policy "Public read available items"
  on menu_items for select using (is_available = true);

-- Authenticated (admin) can do everything
create policy "Admin full access categories"
  on categories for all using (auth.role() = 'authenticated');

create policy "Admin full access menu_items"
  on menu_items for all using (auth.role() = 'authenticated');

-- Seed data
insert into categories (name, slug, description, position) values
  ('Hambúrgueres', 'hamburgueres', 'Nossos burgers artesanais feitos na brasa', 1),
  ('Duplos', 'duplos', 'Para quem quer o dobro de sabor', 2),
  ('Chicken', 'chicken', 'Opções com frango crocante', 3),
  ('Acompanhamentos', 'acompanhamentos', 'Para completar seu pedido', 4),
  ('Bebidas', 'bebidas', 'Refrescantes bebidas para acompanhar', 5);

-- Seed menu items
with cats as (
  select id, slug from categories
)
insert into menu_items (category_id, name, description, price, is_available, is_featured, position, extras)
select
  c.id,
  item.name,
  item.description,
  item.price,
  true,
  item.featured,
  item.pos,
  item.extras::jsonb
from (values
  ('hamburgueres', 'Raiz e Brasa', 'Hambúrguer artesanal 180g grelhado na brasa, queijo prato derretido, alface americana, tomate, cebola roxa, maionese da casa', 32.90, true, 1, '[{"name":"Bacon +","price":4.00},{"name":"Ovo caipira +","price":3.00},{"name":"Queijo extra +","price":2.50}]'),
  ('hamburgueres', 'Caramelizada', 'Hambúrguer 180g, queijo mussarela, cebola caramelizada no açúcar mascavo, bacon crocante, molho especial da casa', 35.90, true, 2, '[{"name":"Bacon extra +","price":4.00},{"name":"Ovo caipira +","price":3.00}]'),
  ('hamburgueres', 'American Classic', 'Hambúrguer 180g, queijo cheddar cremoso, bacon artesanal, picles, ketchup artesanal, maionese da casa', 34.90, false, 3, '[{"name":"Bacon extra +","price":4.00},{"name":"Cheddar extra +","price":3.00}]'),
  ('hamburgueres', 'Smash Burguer', 'Dois smash 90g grelhados na chapa, queijo americano duplo, picles, mostarda, ketchup, cebola crispy', 31.90, false, 4, '[{"name":"Adicionar ovo +","price":3.00}]'),
  ('duplos', 'Exclusivo Duplo', '2x hambúrguer artesanal 150g, 2x queijo prato, bacon duplo, ovo caipira, molho especial, alface, tomate', 42.90, true, 1, '[{"name":"Cebola caramelizada +","price":3.00},{"name":"Queijo extra +","price":2.50}]'),
  ('duplos', 'Double Brasa', '2x hambúrguer 150g na brasa, cheddar duplo, bacon, maionese defumada, cebola roxa', 44.90, false, 2, '[{"name":"Bacon extra +","price":4.00}]'),
  ('chicken', 'Chicken Crispy', 'Frango empanado crocante, queijo prato, alface americana, tomate, maionese da casa', 31.90, false, 1, '[{"name":"Bacon +","price":4.00},{"name":"Cheddar extra +","price":3.00}]'),
  ('acompanhamentos', 'Batata Frita', 'Porção individual de batata frita crocante temperada', 14.90, false, 1, 'null'),
  ('acompanhamentos', 'Batata Bacon & Cheddar', 'Batata frita coberta com bacon crocante e cheddar cremoso', 19.90, false, 2, 'null'),
  ('acompanhamentos', 'Onion Rings', 'Anéis de cebola empanados e crocantes com molho especial', 16.90, false, 3, 'null'),
  ('bebidas', 'Refrigerante Lata', 'Coca-Cola, Guaraná, Sprite ou Fanta — 350ml', 6.00, false, 1, 'null'),
  ('bebidas', 'Suco Natural', 'Laranja, limão ou maracujá — 300ml', 8.00, false, 2, 'null'),
  ('bebidas', 'Água Mineral', 'Sem gás ou com gás — 500ml', 4.00, false, 3, 'null')
) as item(slug, name, description, price, featured, pos, extras)
join cats c on c.slug = item.slug;
