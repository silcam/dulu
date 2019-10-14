json.workshops do
  json.array! @workshops, partial: "workshop", as: :workshop
end

json.can do
  json.create can?(:update, @activity)
end
