# frozen_string_literal: true

json.people @people, partial: 'person_for_index', as: :person

json.can do
  json.create can?(:create, Person)
  json.grant_login can?(:grant_login, Person)
end
