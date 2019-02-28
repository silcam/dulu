json.user_participants current_user.participants do |participant|
  json.call(participant, :id, :person_id, :language_id, :cluster_id)
end

json.user do
  json.call(current_user, :id, :first_name, :last_name)
end

json.regions Lpf.all do |region|
  json.call(region, :id, :name)
end

json.clusters Cluster.all do |cluster|
  json.call(cluster, :id, :name)
  json.region_id cluster.lpf_id
end

json.languages Language.all do |language|
  json.call(language, :id, :name, :cluster_id)
  json.region_id language.lpf_id
end
