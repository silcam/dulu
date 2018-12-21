json.array! @people do |person|
  json.call(person, :id)
  json.name person.full_name
  json.roles person.roles
end