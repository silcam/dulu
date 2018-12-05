# Locals: event, program

json.call(event, :id, :name, :domain, :start_date, :end_date)

json.programs event.programs do |program|
  json.call(program, :id, :name)
end

json.clusters event.clusters do |cluster|
  json.call(cluster, :id, :name)
end

json.event_participants event.event_participants do |participant|
  json.call(participant, :id, :full_name)
  json.person_id participant.person.id
end


