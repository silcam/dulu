# Locals: activities

json.research_activities activities do |activity|
  json.call(activity, :id, :type, :title, :program_id, :stage_name, :category, :participant_ids)
  json.program_name activity.program.name
  json.stage_date activity.current_stage.start_date
  json.last_update activity.updated_at
end