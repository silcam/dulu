json.results do
  json.array! @events do |event|
    json.id(event[:id])
    json.name(event[:title])
  end
end
