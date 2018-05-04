# Locals: person

json.call(person, :id, :first_name, :last_name, :has_login)

orgs = []
orgs << person.organization if person.organization
json.organizations orgs do |org|
  json.call(org, :id, :name, :abbreviation)
end
json.roles(person.roles.collect {|r| t(r) })