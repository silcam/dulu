json.array! @organizations do |org|
  json.call(org, :id, :name)
end
