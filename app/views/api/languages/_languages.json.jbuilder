# frozen_string_literal: true

json.languages languages do |language|
  json.call(language, :id, :name, :cluster_id, :region_id)
end
