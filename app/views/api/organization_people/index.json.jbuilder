# frozen_string_literal: true

json.organizationPeople @org_people, partial: 'org_person', as: :org_person

people = @org_people.map(&:person).uniq
organizations = @org_people.map(&:organization).uniq

json.partial! 'api/people/people', people: people
json.partial! 'api/organizations/organizations', organizations: organizations
