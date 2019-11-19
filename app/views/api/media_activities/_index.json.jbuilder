json.media_activities activities do |activity|
  json.call(activity, :id, :film, :scripture, :type, :language_id, :stage_name, :participant_ids, :category)
  json.stage_date activity.current_stage.start_date
  json.last_update activity.updated_at
end
