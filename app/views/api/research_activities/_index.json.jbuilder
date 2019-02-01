# Locals: activities

json.research_activities activities do |activity|
  json.call(activity, :id, :type, :title, :language_id, :stage_name, :category, :participant_ids)
  json.language_name activity.language.name
  json.stage_date activity.current_stage.start_date
  json.last_update activity.updated_at
end