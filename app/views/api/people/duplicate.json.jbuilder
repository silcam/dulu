json.duplicatePerson do
  json.call(@duplicates.first, :id, :full_name)
end
