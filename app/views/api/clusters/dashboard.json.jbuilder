json.(@cluster, :id, :display_name)

json.languages @cluster.languages, partial: "api/languages/dashboard", as: :language
