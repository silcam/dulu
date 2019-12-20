# frozen_string_literal: true

json.results do
  json.array! @organizations do |org|
    json.call(org, :id, :short_name)
  end
end
