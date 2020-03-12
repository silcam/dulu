# frozen_string_literal: true

json.partial! 'api/clusters/clusters', clusters: @clusters

json.can do
  json.create can?(:create, Cluster)
end
