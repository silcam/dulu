# frozen_string_literal: true

json.partial! 'organizations', organizations: @orgs

json.can do
  json.create can?(:create, Organization)
end
