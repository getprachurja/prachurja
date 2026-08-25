alter table public.catalog_plants
  add column if not exists layer text;

with layers(layer_order, layer, species) as (
  values
    (1, 'Shrub Layer', '["Adhatoda vasica","Adhatoda beddomei","Annona squamosa","Ardisia solanacea","Barleria prionitis","Barleria cristata","Bauhinia tomentosa","Bauhinia acuminata","Berberis aristata","Buddleja asiatica","Calotropis gigantea","Carissa carandas","Clerodendrum inerme","Desmodium intortum","Dodonaea viscosa","Spermadictyon suaveolens","Hibiscus rosa-sinensis","Hiptage benghalensis","Indigofera tinctoria","Jasminum auriculatum","Justicia gendarussa","Lawsonia inermis","Leea indica","Leucas aspera","Nerium oleander","Ocimum tenuiflorum","Ocimum sanctum","Phyllanthus niruri","Plumbago indica","Premna integrifolia","Ruellia tuberosa","Senna auriculata","Solanum nigrum","Solanum torvum","Stachytarpheta jamaicensis","Tephrosia purpurea","Tabernaemontana divaricata","Vitex negundo","Vitex trifolia","Ziziphus oenoplia"]'::jsonb),
    (2, 'Sub-Tree Layer', '["Alangium salviifolium","Aegle marmelos","Aglaia elaeagnoidea","Anogeissus latifolia","Averrhoa carambola","Azima tetracantha","Bauhinia variegata","Butea monosperma","Carissa spinarum","Cassia fistula","Cassia siamea","Cochlospermum religiosum","Cordia dichotoma","Dillenia indica","Erythrina variegata","Ficus hispida","Flacourtia indica","Flagellaria indica","Gmelina asiatica","Grewia asiatica","Hardwickia binata","Holarrhena pubescens","Lagerstroemia indica","Limonia acidissima","Manilkara hexandra","Meyna laxiflora","Mimusops elengi","Morinda citrifolia","Moringa oleifera","Morus alba","Muntingia calabura","Murraya koenigii","Nyctanthes arbor-tristis","Pavetta indica","Phyllanthus acidus","Phyllanthus emblica","Polyalthia longifolia","Polyalthia fragrans","Pongamia pinnata","Psidium guajava","Putranjiva roxburghii","Santalum album","Sapindus emarginatus","Saraca asoca","Simarouba glauca","Spondias pinnata","Woodfordia floribunda","Wrightia tinctoria","Ziziphus mauritiana","Ziziphus rugosa"]'::jsonb),
    (3, 'Tree Layer', '["Acacia catechu","Acacia nilotica","Ailanthus excelsa","Albizia amara","Albizia lebbeck","Albizia odoratissima","Alstonia scholaris","Azadirachta indica","Cassia javanica","Dalbergia latifolia","Dalbergia sissoo","Delonix regia","Diospyros malabarica","Diospyros montana","Dolichandrone falcata","Gmelina arborea","Jacaranda mimosifolia","Kydia calycina","Lannea coromandelica","Litsea glutinosa","Madhuca indica","Mangifera indica","Melia azedarach","Melia dubia","Miliusa tomentosa","Millingtonia hortensis","Prosopis cineraria","Pterocarpus santalinus","Pterospermum acerifolium","Pterocarpus marsupium","Schleichera oleosa","Shorea robusta","Shorea tumbuggaia","Spathodea campanulata","Sterculia urens","Tamarindus indica","Tabebuia pallida","Tectona grandis","Terminalia bellirica","Terminalia catappa","Terminalia chebula","Toona ciliata","Trewia nudiflora"]'::jsonb),
    (4, 'Canopy Tree Layer', '["Artocarpus heterophyllus","Artocarpus lacucha","Barringtonia acutangula","Bombax ceiba","Ficus benghalensis","Ficus benjamina","Ficus mysorensis","Ficus racemosa","Ficus religiosa","Ficus virens","Michelia champaca","Neolamarckia cadamba","Ochrocarpus longifolius","Swietenia mahagoni","Syzygium cumini","Terminalia arjuna","Thespesia populnea"]'::jsonb)
), source as (
  select
    layer_order,
    layer,
    botanical,
    species_order,
    case botanical
      when 'Azadirachta indica' then 'neem'
      when 'Terminalia arjuna' then 'arjun'
      when 'Syzygium cumini' then 'jamun'
      when 'Phyllanthus emblica' then 'amla'
      when 'Ficus benghalensis' then 'banyan'
      when 'Ficus religiosa' then 'peepal'
      when 'Butea monosperma' then 'palash'
      when 'Neolamarckia cadamba' then 'kadamba'
      when 'Pongamia pinnata' then 'karanj'
      when 'Shorea robusta' then 'sal'
      when 'Acacia catechu' then 'khair'
      when 'Dalbergia sissoo' then 'shisham'
      when 'Terminalia bellirica' then 'baheda'
      when 'Terminalia chebula' then 'harad'
      when 'Schleichera oleosa' then 'kusum'
      when 'Putranjiva roxburghii' then 'putranjiva'
      when 'Pterospermum acerifolium' then 'kanak-champa'
      else trim(both '-' from regexp_replace(lower(botanical), '[^a-z0-9]+', '-', 'g'))
    end as id
  from layers
  cross join lateral jsonb_array_elements_text(species) with ordinality as item(botanical, species_order)
)
insert into public.catalog_plants (
  id, common_name, botanical_name, layer, region, ecological_role,
  water_requirement, plant_size, price, stock_status, image_url, description,
  featured, active, sort_order
)
select
  id,
  botanical,
  botanical,
  layer,
  'Indian restoration reference list · verify local range and provenance',
  layer || ' structure and diversity',
  case when layer_order = 3 then 'Low' else 'Moderate' end,
  case layer_order when 1 then '30–45 cm' when 2 then '45–75 cm' when 3 then '60–90 cm' else '75–120 cm' end,
  case layer_order when 1 then 85 when 2 then 135 when 3 then 175 else 225 end + ((species_order - 1) % 6) * 10,
  case when species_order % 11 = 1 then 'Contract grow' when species_order % 7 = 1 then 'Low stock' else 'Available' end,
  '/api/plant-image?name=' || replace(botanical, ' ', '%20') || '&layer=' || replace(layer, ' ', '%20'),
  'Listed in the supplied vegetation palette under ' || layer || '. Confirm regional nativity, provenance and site suitability before selection.',
  false,
  true,
  layer_order * 1000 + species_order
from source
on conflict (id) do update set
  botanical_name = excluded.botanical_name,
  layer = excluded.layer,
  ecological_role = excluded.ecological_role,
  image_url = case when public.catalog_plants.image_url = '' then excluded.image_url else public.catalog_plants.image_url end,
  active = true,
  sort_order = excluded.sort_order,
  updated_at = now();

update public.catalog_plants
set layer = 'Tree Layer'
where layer is null;

alter table public.catalog_plants
  alter column layer set default 'Tree Layer',
  alter column layer set not null;

do $$
begin
  alter table public.catalog_plants
    add constraint catalog_plants_layer_check
    check (layer in ('Shrub Layer', 'Sub-Tree Layer', 'Tree Layer', 'Canopy Tree Layer'));
exception when duplicate_object then null;
end $$;

create index if not exists catalog_plants_layer_active_sort_idx
  on public.catalog_plants (layer, sort_order)
  where active = true;
