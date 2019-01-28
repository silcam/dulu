json.activity do
  json.call(@activity, :id)
  json.language do
    json.call(@activity.program, :id, :name)
  end
end
