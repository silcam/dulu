# Locals: activity

json.participants activity.participants do |participant|
  json.call(participant, :id, :person_id, :language_id, :cluster_id)
end

json.people activity.participants do |participant|
  json.call(participant.person, :id, :first_name, :last_name)
end
