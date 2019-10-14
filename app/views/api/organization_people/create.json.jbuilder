json.organization_person do
  json.partial! "org_person", org_person: @org_person
end

json.organization do
  json.call(@org_person.organization, :id, :short_name)
end
