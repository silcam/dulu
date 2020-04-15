# frozen_string_literal: true

json.regions [@region] do |region|
  json.call(region, :id, :name, :lpf_id)

  json.can do
    json.update can? :update, region
    json.destroy can? :destroy, region
  end
end

cluster_ids = @region.cluster_ids + (@old_cluster_ids || [])
language_ids = @region.language_ids + (@old_language_ids || [])

json.partial! 'api/clusters/clusters', clusters: Cluster.where(id: cluster_ids)
json.partial! 'api/languages/languages', languages: Language.where(id: language_ids)
