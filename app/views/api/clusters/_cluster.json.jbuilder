# Locals: cluster

json.call(cluster, :id, :name)

json.languages cluster.programs do |language|
  json.call(language, :id, :name)
end