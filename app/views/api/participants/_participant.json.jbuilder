json.call(participant, :id, :roles, :start_date, :end_date, :person_id)

if participant.language_id
  json.language_id participant.language_id
else
  json.cluster_id participant.cluster_id
end
