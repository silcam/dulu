json.stage do
  json.call(@stage, :id, :name, :start_date, :activity_id)
  json.last_update @stage.updated_at
end