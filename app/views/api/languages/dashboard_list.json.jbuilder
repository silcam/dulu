# frozen_string_literal: true

json.participants current_user.participants do |participant|
  json.call(participant, :id, :person_id, :language_id, :cluster_id)
end

json.partial! 'api/people/people', people: [current_user]

regions = Region.all
clusters = Cluster.where(region: regions)
json.partial! 'api/regions/regions', regions: regions
json.partial! 'api/clusters/clusters', clusters: clusters
json.partial!(
  'api/languages/languages', 
  languages: Language.where('region_id IN (?) OR cluster_id IN (?)', regions.map(&:id), clusters.map(&:id))
)
