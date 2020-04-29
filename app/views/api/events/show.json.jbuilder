# frozen_string_literal: true

json.languages @event.languages do |language|
  json.call(language, :id, :name)
end

json.clusters @event.clusters do |cluster|
  json.call(cluster, :id, :name)
end

json.people @event.people do |person|
  json.call(person, :id, :first_name, :last_name)
end

if @event.workshop
  json.partial! 'api/activities/activities', activities: [@event.workshop.linguistic_activity]
else
  json.activities []
end

json.events [@event] do |_event|
  json.call(@event, :id, :name, :domain, :start_date, :end_date, :note, :language_ids, :cluster_ids, :category, :subcategory)
  json.location { json.call(@event.event_location, :id, :name) } if @event.event_location

  json.event_participants @event.event_participants do |e_p|
    json.call(e_p, :id, :person_id, :roles)
  end

  json.dockets @event.dockets do |es|
    json.call(es, :id, :event_id, :series_event_id)
    json.name @event.series_events.find(es.series_event_id).name
  end

  if @event.workshop
    json.workshop_id @event.workshop.id
    json.workshop_activity_id @event.workshop.linguistic_activity_id
  end

  json.can do
    json.update(can?(:update, @event))
    json.destroy(can?(:destroy, @event))
  end
end
