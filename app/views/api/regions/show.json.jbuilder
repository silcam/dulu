json.region do
  json.call(@region, :id, :name, :person_id)

  json.can do
    json.update can? :update, @region
    json.destroy can? :destroy, @region
  end
end

people = @region.person ? [@region.person] : []

json.people people do |person|
  json.call(person, :id, :first_name, :last_name)
end

clusters = @old_clusters ? (@region.clusters + @old_clusters).uniq : @region.clusters
json.clusters clusters do |cluster|
  json.call(cluster, :id, :name)
  json.region_id cluster.lpf_id
end

languages = @old_languages ? (@region.languages + @old_languages).uniq : @region.languages
json.languages languages do |language|
  json.call(language, :id, :name)
  json.region_id language.lpf_id
end
