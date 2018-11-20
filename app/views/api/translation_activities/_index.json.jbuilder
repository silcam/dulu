# Locals: activities

json.translation_activities activities do |activity|
  json.call(activity, :id, :program_id, :bible_book_id, :stage_name)

  json.program_name @program.name
  json.stage_date activity.current_stage.start_date
  json.last_update activity.updated_at
end