json.(@cluster, :id)
json.displayName @cluster.display_name

json.programs @cluster.programs, partial: 'api/programs/dashboard', as: :program