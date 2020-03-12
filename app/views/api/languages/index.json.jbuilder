# frozen_string_literal: true

json.partial! 'api/languages/languages', languages: @languages

json.partial! 'api/clusters/clusters', clusters: Cluster.where(id: @languages.map(&:cluster_id))

json.partial! 'api/regions/regions', regions: Region.where(id: @languages.map(&:region_id))

json.can do
  json.create false
end
