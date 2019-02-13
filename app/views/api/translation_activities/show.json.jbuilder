json.activity do
  json.call(@activity, :id, :language_id, :bible_book_id, :stage_name, :type, :participant_ids)
  json.stage_date @activity.current_stage.start_date
  json.last_update @activity.updated_at
end

json.partial! "api/activities/participants", activity: @activity