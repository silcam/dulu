# frozen_string_literal: true

json.clusters clusters do |cluster|
  json.call(cluster, :id, :name, :region_id)
end
