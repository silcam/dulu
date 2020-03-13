# frozen_string_literal: true

json.partial! 'api/regions/regions', regions: @regions

json.can do
  json.regions do
    json.create can?(:create, Region)
  end
end
