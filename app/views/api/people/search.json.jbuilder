json.array! @people do |person|
  json.call(person, :id, :first_name, :last_name)
  json.name person.full_name
  json.roles person.roles
end