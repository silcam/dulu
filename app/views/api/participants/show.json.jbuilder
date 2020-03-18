# frozen_string_literal: true

json.participants [@participant] do |participant|
  json.call(participant, :id, :roles, :start_date, :end_date, :person_id, :language_id, :cluster_id)

  can = can?(:manage_participants, participant.cluster_language)
  json.can do
    json.update can
    json.destroy can
  end
end

json.partial! 'api/people/people', people: [@participant.person]
json.partial! 'api/activities/activities', activities: @participant.activities

if @participant.language
  json.partial! 'api/languages/languages', languages: [@participant.language]
else
  json.partial! 'api/clusters/clusters', clusters: [@participant.cluster]
end
