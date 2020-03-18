# frozen_string_literal: true

json.partial! 'participants', participants: @participants

json.partial! 'api/people/people', people: Person.where(id: @participants.map(&:person_id))

if @cluster_language.is_a? Language
  json.partial! 'api/languages/languages', languages: [@cluster_language]
else
  json.partial! 'api/clusters/clusters', clusters: [@cluster_language]
end
