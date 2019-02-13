json.(workshop, :id, :name, :number, :event_id)

json.completed workshop.completed?
json.activityId workshop.linguistic_activity_id

json.date workshop.f_date.to_s
json.formattedDate workshop.f_date.try(:pretty_print)
