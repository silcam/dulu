json.clusters @clusters do |cluster|
  json.call(cluster, :id, :name, :region_id)
end

json.can do
  json.create can?(:create, Cluster)
end
