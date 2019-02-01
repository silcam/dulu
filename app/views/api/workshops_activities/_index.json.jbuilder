# Locals: activities

json.workshops_activities activities do |activity|
  json.call(activity, :id, :type, :title, :language_id, :category, :participant_ids)
  json.language_name activity.language.name
  json.last_update activity.updated_at
  json.workshops Workshop.sort(activity.workshops), partial: 'api/workshops/workshop', as: :workshop
end