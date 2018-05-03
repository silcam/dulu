# Locals: event

json.call(event, :id, :name, :start_date, :end_date)

cluster_programs = event.programs + event.clusters
json.cluster_programs cluster_programs do |cluster_program|
  json.name cluster_program.display_name
  json.path polymorphic_path(cluster_program)
end