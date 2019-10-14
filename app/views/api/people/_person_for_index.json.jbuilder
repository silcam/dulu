# Locals: person

json.call(person, :id, :first_name, :last_name, :has_login)

# json.organization_people @person.organization_people do |org_person|
#   json.partial! '/api/organization_people/org_person', org_person: org_person
# end
# json.organizations person.current_orgs do |org|
#   json.call(org, :id, :name)
# end
# json.roles(person.roles.collect {|r| t(r) })
