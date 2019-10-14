json.organization_people @org_people, partial: "org_person", as: :org_person

json.people @org_people do |org_person|
  json.call(org_person.person, :id, :first_name, :last_name)
end

json.organizations @org_people do |org_person|
  json.call(org_person.organization, :id, :short_name)
end
