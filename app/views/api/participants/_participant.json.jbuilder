json.call(participant, :id, :roles, :start_date, :end_date, :activity_ids)

json.person do
  json.call(participant.person, :id, :full_name)
end

if participant.program
  json.language do
    json.call(participant.program, :id, :name)
  end
end

if participant.cluster
  json.cluster do
    json.call(participant.cluster, :id, :name)
  end
end
