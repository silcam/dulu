json.(workshop, :id, :name, :number)

json.completed workshop.completed?

json.date workshop.f_date.try(:pretty_print)

if workshop.event
  json.event do 
    json.path program_event_path(workshop.linguistic_activity.program, workshop.event)
  end
end