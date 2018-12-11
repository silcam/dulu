json.array! @people do |person|
  json.call(person, :id)
  json.name person.full_name
end