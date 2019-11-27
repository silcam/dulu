json.regions @regions do |region|
  json.call(region, :id, :name)
end

json.can do
  json.create can?(:create, Region)
end
