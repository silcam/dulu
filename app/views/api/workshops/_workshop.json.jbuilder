json.(workshop, :id, :name, :number)

json.completed workshop.completed?

json.date workshop.f_date.to_s
json.formattedDate workshop.f_date.try(:pretty_print)

json.can do
  manage = can? :update, workshop.linguistic_activity
  json.update manage
  json.delete manage
end

program = workshop.linguistic_activity.program
if workshop.event
  json.eventPath program_event_path(program, workshop.event)
else
  json.newEventPath new_program_event_path(program, 
                                            workshop: workshop, 
                                            referred_by: activity_path(workshop.linguistic_activity))
end