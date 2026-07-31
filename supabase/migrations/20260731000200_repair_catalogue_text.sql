update public.catalog_plants
set
  plant_size = replace(plant_size, 'â€“', '–'),
  updated_at = now()
where plant_size like '%â€“%';
