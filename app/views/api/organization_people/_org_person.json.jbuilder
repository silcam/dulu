# Locals: org_person

json.call(org_person, :id, :position, :start_date, :end_date)

json.person do
  json.call(org_person.person, :id, :full_name)
end

json.organization do
  json.call(org_person.organization, :id, :name)
end