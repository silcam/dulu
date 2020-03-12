# frozen_string_literal: true

json.partial! 'api/people/people', people: @people

json.can do
  json.people do
    json.create can?(:create, Person)
    json.grant_login can?(:grant_login, Person)
  end
end
