# Locals: event, language

json.call(event, :id, :name, :domain, :start_date, :end_date, :note, :category, :subcategory)

json.languages event.languages do |language|
  json.call(language, :id, :name)
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

