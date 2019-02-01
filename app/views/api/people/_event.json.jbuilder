# Locals: event

json.call(event, :id, :name, :start_date, :end_date)

cluster_languages = event.languages + event.clusters
json.cluster_languages cluster_languages do |cluster_language|
  json.name cluster_language.display_name
  json.path model_path(cluster_language)
end