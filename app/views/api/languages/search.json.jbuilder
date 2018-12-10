json.array! @programs do |program|
  json.call(program, :id, :name)
end