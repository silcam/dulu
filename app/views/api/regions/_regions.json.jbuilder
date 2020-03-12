# frozen_string_literal: true

json.regions regions do |region|
  json.call(region, :id, :name)
end
