json.(@cluster, :id, :display_name)

json.programs @cluster.programs, partial: 'api/programs/dashboard', as: :program