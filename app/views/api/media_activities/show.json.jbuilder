json.activity do
  json.call(@activity, :id, :language_id, :film, :scripture, :type, :stage_name, :participant_ids, :category)
  json.stage_date @activity.current_stage.start_date
  json.last_update @activity.updated_at
end

json.partial! "api/activities/participants", activity: @activity
