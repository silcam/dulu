json.(workshop, :id, :name, :number)

json.completed workshop.completed?
json.activityId workshop.linguistic_activity_id

json.date workshop.f_date.to_s
json.formattedDate workshop.f_date.try(:pretty_print)

json.can do
  manage = can? :update, workshop.linguistic_activity
  json.update manage
  json.delete manage
end

language = workshop.linguistic_activity.language
if workshop.event
  json.eventPath model_path(language, workshop.event)
else
  json.newEventPath model_path(language) + "/events/new"
end