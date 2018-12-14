json.clusters @clusters do |cluster|
  json.call(cluster, :id, :name)
end

json.can do
  json.create can?(:create, Cluster)
end