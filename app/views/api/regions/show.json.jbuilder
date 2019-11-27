json.region do
  json.call(@region, :id, :name, :lpf_id)

  json.can do
    json.update can? :update, @region
    json.destroy can? :destroy, @region
  end
end

if @region_updated
  json.clusters Cluster.all do |cluster|
    json.call(cluster, :id, :name, :region_id)
  end

  json.languages Language.all do |language|
    json.call(language, :id, :name, :region_id)
  end
end
