alter table private.api_credentials enable row level security;

drop policy if exists api_credentials_explicit_deny on private.api_credentials;
create policy api_credentials_explicit_deny
on private.api_credentials
as restrictive
for all
to anon, authenticated
using (false)
with check (false);

create table if not exists public.catalog_plants (
  id text primary key,
  common_name text not null,
  botanical_name text not null,
  region text not null,
  ecological_role text not null,
  water_requirement text not null check (water_requirement in ('Low', 'Moderate', 'High')),
  plant_size text not null,
  price numeric(12,2) not null check (price >= 0),
  stock_status text not null check (stock_status in ('Available', 'Low stock', 'Contract grow')),
  image_url text not null default '',
  description text not null default '',
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_products (
  id text primary key,
  name text not null,
  category text not null,
  producer text not null,
  location text not null,
  price numeric(12,2) not null check (price >= 0),
  badge text not null default '',
  image_url text not null default '',
  description text not null default '',
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id text primary key,
  title text not null,
  excerpt text not null,
  body text not null default '',
  category text not null,
  read_time text not null default '5 min',
  cover_image_url text not null default '',
  status text not null default 'Draft' check (status in ('Draft', 'Published')),
  featured boolean not null default false,
  author_email text not null default '',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restoration_projects (
  id text primary key,
  title text not null,
  location text not null,
  area text not null,
  project_type text not null,
  status text not null,
  species_count integer not null default 0 check (species_count >= 0),
  period text not null,
  progress integer not null default 0 check (progress between 0 and 100),
  summary text not null default '',
  image_url text not null default '',
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalog_plants_active_sort_idx on public.catalog_plants (active, sort_order, common_name);
create index if not exists marketplace_products_active_sort_idx on public.marketplace_products (active, sort_order, name);
create index if not exists blog_posts_status_published_idx on public.blog_posts (status, published_at desc) where status = 'Published';
create index if not exists restoration_projects_published_sort_idx on public.restoration_projects (published, sort_order, title);

do $$
declare table_name text;
begin
  foreach table_name in array array['catalog_plants', 'marketplace_products', 'blog_posts', 'restoration_projects'] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('drop policy if exists prachurja_server_access on public.%I', table_name);
    execute format(
      'create policy prachurja_server_access on public.%I for all to anon using ((select private.has_valid_app_secret())) with check ((select private.has_valid_app_secret()))',
      table_name
    );
    execute format('grant select, insert, update, delete on public.%I to anon', table_name);
    execute format('revoke all on public.%I from authenticated', table_name);
  end loop;
end $$;

insert into public.catalog_plants (id, common_name, botanical_name, region, ecological_role, water_requirement, plant_size, price, stock_status, image_url, sort_order)
values
  ('neem','Neem','Azadirachta indica','Central & peninsular India','Drought resistant','Low','60–90 cm',145,'Available','https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Neem_Tree_in_Rajasthan%2C_India.jpg/330px-Neem_Tree_in_Rajasthan%2C_India.jpg',1),
  ('arjun','Arjun','Terminalia arjuna','Riverine plains','Riverbank species','High','75–100 cm',190,'Available','https://upload.wikimedia.org/wikipedia/commons/9/94/Fruit_I_IMG_9577.jpg',2),
  ('jamun','Jamun','Syzygium cumini','Tropical & subtropical India','Bird attracting','Moderate','60–90 cm',175,'Available','https://upload.wikimedia.org/wikipedia/commons/b/b3/Syzygium_cumini_Bra30.png',3),
  ('mahua','Mahua','Madhuca longifolia','Central Indian dry forests','Community livelihood','Low','45–60 cm',210,'Low stock','https://upload.wikimedia.org/wikipedia/commons/6/61/Mahuwa_trees_in_Chhattisgarh.jpg',4),
  ('amla','Amla','Phyllanthus emblica','Dry deciduous zones','Agroforestry species','Low','45–75 cm',160,'Available','https://upload.wikimedia.org/wikipedia/commons/7/7f/Phyllanthus_officinalis.jpg',5),
  ('banyan','Banyan','Ficus benghalensis','Most Indian plains','Keystone canopy tree','Moderate','60–90 cm',280,'Contract grow','https://upload.wikimedia.org/wikipedia/commons/9/9f/Great_banyan_tree_kol.jpg',6),
  ('peepal','Peepal','Ficus religiosa','Plains & lower hills','Wildlife supporting','Moderate','60–90 cm',240,'Low stock','https://upload.wikimedia.org/wikipedia/commons/9/94/Ficus_religiosa_Bo.jpg',7),
  ('palash','Palash','Butea monosperma','Dry deciduous India','Pollinator supporting','Low','45–75 cm',185,'Available','https://upload.wikimedia.org/wikipedia/commons/3/38/STS_001_Butea_monosperma.jpg',8),
  ('kadamba','Kadamba','Neolamarckia cadamba','Moist tropical India','Fast canopy formation','High','75–100 cm',195,'Available','https://upload.wikimedia.org/wikipedia/commons/d/dc/Neolamarckia_cadamba_6226.jpg',9),
  ('karanj','Karanj','Millettia pinnata','Coasts & river systems','Nitrogen fixing','Moderate','60–90 cm',155,'Available','https://upload.wikimedia.org/wikipedia/commons/1/1b/Pongamia_pinnata_%28Karanj%29_near_Hyderabad_W_IMG_7633.jpg',10),
  ('tendu','Tendu','Diospyros melanoxylon','Central Indian forests','Understorey tree','Low','30–45 cm',170,'Contract grow','https://upload.wikimedia.org/wikipedia/commons/b/bb/Bark_of_Diospyros_melanoxylon.jpg',11),
  ('sal','Sal','Shorea robusta','Northern & central moist forests','Canopy tree','Moderate','45–60 cm',230,'Contract grow','https://upload.wikimedia.org/wikipedia/commons/f/fd/Shorea_robusta.jpg',12),
  ('khair','Khair','Senegalia catechu','Dry forests & foothills','Soil stabilising','Low','45–60 cm',150,'Available','https://upload.wikimedia.org/wikipedia/commons/a/a4/Acacia_catechu_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-003.jpg',13),
  ('shisham','Shisham','Dalbergia sissoo','Indo-Gangetic riverine belt','Pioneer species','Moderate','60–90 cm',180,'Available','https://upload.wikimedia.org/wikipedia/commons/e/e9/Dalbergia_sissoo_Bra24.png',14),
  ('baheda','Baheda','Terminalia bellirica','Moist deciduous India','Bird attracting','Moderate','60–90 cm',205,'Low stock','https://upload.wikimedia.org/wikipedia/commons/7/74/Terminalia_bellirica.jpg',15),
  ('harad','Harad','Terminalia chebula','Sub-Himalayan & deciduous belts','Canopy tree','Moderate','45–75 cm',215,'Contract grow','https://upload.wikimedia.org/wikipedia/commons/f/ff/Harra_%28Terminalia_chebula%29_leafless_tree_at_23_Mile%2C_Duars%2C_WB_W_IMG_5905.jpg',16),
  ('kusum','Kusum','Schleichera oleosa','Central & eastern India','Wildlife supporting','Low','45–60 cm',225,'Available','https://upload.wikimedia.org/wikipedia/commons/1/1e/Schleic_oleos_080320-5971_rgn.JPG',17),
  ('bamboo','Male Bamboo','Dendrocalamus strictus','Dry deciduous India','Soil stabilising','Low','60–90 cm',135,'Available','https://upload.wikimedia.org/wikipedia/commons/5/52/Bamboo_leaves1.JPG',18),
  ('putranjiva','Putranjiva','Putranjiva roxburghii','Moist deciduous plains','Bird attracting','Moderate','45–75 cm',200,'Low stock','https://commons.wikimedia.org/wiki/Special:Redirect/file/Putranjiva_roxburghii_01.JPG?width=1000',19),
  ('kanak-champa','Kanak Champa','Pterospermum acerifolium','Eastern & northeastern India','Pollinator supporting','Moderate','60–90 cm',260,'Contract grow','https://upload.wikimedia.org/wikipedia/commons/8/8f/Kanak_Champa_%28Pterospermum_acerifolium%29_in_Hyderabad_W_IMG_7126.jpg',20)
on conflict (id) do nothing;

insert into public.marketplace_products (id, name, category, producer, location, price, badge, sort_order)
values
  ('biochar','Community Biochar','Soil Products','Satpura Soil Collective','Mandla, MP',620,'Invasive-to-Asset',1),
  ('vermicompost','Screened Vermicompost','Soil Products','Mati Women’s Group','Nagpur, MH',280,'Locally made',2),
  ('mulch','Organic Leaf Mulch','Soil Products','Green Loop Works','Pune, MH',190,'Low-waste',3),
  ('tree-guard','Bamboo Tree Guard','Bamboo Products','Van Saathi Crafts','Dindori, MP',340,'Community made',4),
  ('plant-guard','Biodegradable Plant Guard','Plantation Supplies','EarthWeave Works','Nashik, MH',85,'Plastic-light',5),
  ('seed-kit','Native Meadow Seed Kit','Community Products','Deccan Seed Circle','Dharwad, KA',460,'Local provenance',6),
  ('grow-bags','Reusable Nursery Grow Bags','Nursery Supplies','Green Loop Works','Pune, MH',520,'Reusable',7),
  ('coir','Coir Root Trainer Set','Nursery Supplies','Coast Fibre Guild','Alappuzha, KL',390,'Natural fibre',8),
  ('stakes','Bamboo Marking Stakes','Plantation Supplies','Van Saathi Crafts','Dindori, MP',210,'Community made',9),
  ('mulch-mat','Jute Mulch Mats','Plantation Supplies','EarthWeave Works','Nashik, MH',260,'Biodegradable',10),
  ('basket','Field Collection Basket','Community Products','Van Saathi Crafts','Dindori, MP',480,'Community made',11),
  ('briquette','Biomass Soil Briquettes','Invasive-Biomass Products','Satpura Soil Collective','Mandla, MP',310,'Conditional reuse',12)
on conflict (id) do nothing;

insert into public.restoration_projects (id, title, location, area, project_type, status, species_count, period, progress, summary, sort_order)
values
  ('satpura-corridor','Satpura Habitat Corridor','Betul, Madhya Pradesh','32 ha','Degraded land restoration','Maintenance year 2',38,'36 months',68,'A long-term habitat recovery programme connecting native planting, maintenance and field evidence.',1),
  ('deccan-watershed','Deccan Watershed Slopes','Satara, Maharashtra','18 ha','Watershed restoration','Plantation active',27,'24 months',46,'Slope and drainage-line recovery designed around soil stability and seasonal water movement.',2),
  ('bengaluru-campus','Bengaluru Campus Mosaic','Bengaluru, Karnataka','6.5 ha','Urban native forest','Monitoring',52,'36 months',81,'A campus-scale mosaic of native habitat, public use and repeat ecological monitoring.',3),
  ('vidarbha-farm','Vidarbha Farm Commons','Wardha, Maharashtra','14 ha','Agroforestry','Soil preparation',21,'24 months',29,'Farm resilience work combining soil recovery, productive boundaries and native diversity.',4),
  ('chambal-riparian','Chambal Riparian Reach','Kota, Rajasthan','9 km','Riverbank restoration','Baseline assessment',19,'48 months',18,'Reach-wise assessment and native riparian recovery along a disturbed river corridor.',5),
  ('odisha-mine-edge','Odisha Mine-Edge Recovery','Keonjhar, Odisha','46 ha','Soil rehabilitation','Ecological planning',31,'60 months',22,'Phased soil rehabilitation and ecological planning across a heavily disturbed landscape edge.',6)
on conflict (id) do nothing;

insert into public.blog_posts (id, title, excerpt, body, category, read_time, status, featured, author_email, published_at)
values
  ('why-native-species-matter','Why native species matter in ecological restoration','How regional ecology, provenance and site conditions shape responsible species selection.','Native species selection begins with a reference ecosystem and an understanding of the site. A list of familiar trees is not a restoration plan. Soil, hydrology, natural regeneration, seed provenance and long-term maintenance all influence which species belong—and whether planting is appropriate at all.','Species guides','8 min','Published',true,'Prachurja editorial',now()),
  ('plantation-versus-restoration','Plantation versus ecosystem restoration','Why planting totals alone cannot demonstrate ecological recovery.','Plantation is one possible intervention within restoration. Restoration begins with a baseline, identifies the pressures preventing recovery, and chooses protection, assisted regeneration, soil work or planting accordingly. Monitoring then tests whether ecological function is returning.','Restoration guides','6 min','Published',false,'Prachurja editorial',now()),
  ('pioneer-species-and-soil','How pioneer species help degraded soil','A field introduction to early succession, soil cover and recovery pathways.','Pioneer vegetation can reduce exposure, slow erosion and create conditions for later succession. The right approach depends on disturbance history, nearby seed sources, invasive pressure and whether natural regeneration is already occurring.','Soil & water','7 min','Published',false,'Prachurja editorial',now()),
  ('bird-friendly-native-garden','Planning a bird-friendly native garden','Design seasonal food, shelter and water without forcing unsuitable species.','A useful habitat garden provides structure through the year. Combine locally appropriate canopy, shrub and ground layers, avoid pesticides, retain safe leaf litter and provide clean water while keeping sight lines and maintenance realistic.','Species guides','5 min','Published',false,'Prachurja editorial',now()),
  ('long-term-maintenance','What long-term plantation maintenance includes','From watering and guards to survival sampling and corrective action.','Maintenance is planned work, not an afterthought. It includes seasonal watering, mulch, guards, invasive control, replacement thresholds, survival sampling, issue logs and corrective action tied to field evidence.','Restoration guides','9 min','Published',false,'Prachurja editorial',now()),
  ('responsible-invasive-biomass','Responsible uses of invasive biomass','When removed biomass can be reused—and when containment must come first.','Any reuse pathway must prevent seed or vegetative spread, follow local rules and avoid creating a market incentive to maintain the invasion. Containment, handling and disposal decisions come before product ideas.','Invasive species','6 min','Published',false,'Prachurja editorial',now())
on conflict (id) do nothing;
