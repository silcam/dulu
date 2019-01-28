# Locals: activities

json.workshops_activities activities do |activity|
  json.call(activity, :id, :type, :title, :program_id, :category)
  json.program_name activity.program.name
  json.last_update activity.updated_at
  json.workshops Workshop.sort(activity.workshops), partial: 'api/workshops/workshop', as: :workshop
end