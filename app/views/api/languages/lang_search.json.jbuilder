
json.array! @programs do |program|
  json.call(program.language, :id, :name)
end