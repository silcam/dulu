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

program = workshop.linguistic_activity.program
if workshop.event
  json.eventPath model_path(program, workshop.event)
else
  json.newEventPath model_path(program) + "/events/new"
end