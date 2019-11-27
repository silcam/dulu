json.languages @languages do |language|
  json.call(language, :id, :name, :cluster_id, :region_id)
  json.code language.code_or_parent_code
end

json.can do
  json.create false
end
