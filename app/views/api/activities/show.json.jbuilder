json.activity do
  json.call(@activity, :id)
  json.language do
    json.call(@activity.language, :id, :name)
  end
end
