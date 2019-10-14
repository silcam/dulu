json.results do
  json.array! @countries do |country|
    json.call(country, :id, :name)
  end
end
