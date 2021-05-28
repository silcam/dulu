json.results do
  json.array! @tags do |tag|
    json.id tag.id
    json.name tag.tagname
  end
end
