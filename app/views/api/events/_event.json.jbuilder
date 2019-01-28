# Locals: event, program

json.call(event, :id, :name, :domain, :start_date, :end_date, :note)

json.programs event.programs do |program|
  json.call(program, :id, :name)
end

json.clusters event.clusters do |cluster|
  json.call(cluster, :id, :name)
end

json.event_participants event.event_participants do |participant|
  json.call(participant, :id, :full_name, :roles)
  json.person_id participant.person.id
end

if event.workshop
  json.workshop do
    json.id event.workshop.id
    json.activityId event.workshop.linguistic_activity_id
  end
end

json.can do
  json.update can?(:update, event)
  json.destroy can?(:destroy, event)
end

