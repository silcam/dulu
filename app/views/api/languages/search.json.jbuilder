json.array! @languages do |language|
  json.call(language, :id, :name)
end
