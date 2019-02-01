json.region do
  json.call(@region, :id, :name)

  if @region.person
    json.person do
      json.call(@region.person, :id, :name)
    end
  else
    json.person({})
  end

  json.clusters @region.clusters do |cluster|
    json.call(cluster, :id, :name)
  end

  json.languages @region.languages do |language|
    json.call(language, :id, :name)
  end

  json.can do
    json.update can? :update, @region
    json.destroy can? :destroy, @region
  end

  json.loaded true
end