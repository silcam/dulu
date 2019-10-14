json.activity do
  json.call(@activity, :id, :language_id, :type, :title, :category)
  json.last_update @activity.updated_at
  json.workshops Workshop.sort(@activity.workshops), partial: "api/workshops/workshop", as: :workshop
end

json.partial! "api/activities/participants", activity: @activity
