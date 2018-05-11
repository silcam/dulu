# Locals: org

json.call(org, :id, :short_name, :long_name, :description)


json.country do
  if org.country
    json.call(org.country, :id, :name)
  else
    json.id nil
    json.name ''
  end
end

json.parent do
  if org.parent
    json.call(org.parent, :id, :name)
  else
    json.id nil
    json.name ''
  end
end