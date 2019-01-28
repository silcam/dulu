json.array! @clusters do |cluster|
  json.call(cluster, :id, :name)
end