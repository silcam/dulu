# frozen_string_literal: true

json.call(workshop, :id, :name, :event_id)

json.completed workshop.completed?
json.activityId workshop.linguistic_activity_id

json.date workshop.f_date.to_s
