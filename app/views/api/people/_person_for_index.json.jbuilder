# Locals: person

json.call(person, :id, :first_name, :last_name, :has_login)

json.organizations person.current_orgs do |org|
  json.call(org, :id, :name)
end
json.roles(person.roles.collect {|r| t(r) })