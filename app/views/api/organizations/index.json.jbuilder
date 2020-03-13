# frozen_string_literal: true

json.partial! 'organizations', organizations: @orgs

json.can do
  json.organizations do
    json.create can?(:create, Organization)
  end
end
