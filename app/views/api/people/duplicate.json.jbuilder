# frozen_string_literal: true

json.duplicates @duplicates do |duplicate|
  json.call(duplicate, :id, :full_name, :email)
  json.country duplicate.country ? duplicate.country.name : ''
  json.organizations duplicate.organizations do |org|
    json.call(org, :id, :name)
  end
end
