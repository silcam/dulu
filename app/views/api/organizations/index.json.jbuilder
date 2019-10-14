json.organizations @orgs, partial: "org", as: :org

json.can do
  json.create can?(:create, Organization)
end
