# Locals: activities

json.translation_activities activities do |activity|
  json.call(activity, :id, :language_id, :bible_book_id, :stage_name, :type, :participant_ids)

  json.language_name @language.name
  json.stage_date activity.current_stage.start_date
  json.last_update activity.updated_at
end