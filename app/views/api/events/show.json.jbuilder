json.event do
  json.partial! 'event', event: @event
end

if @event.workshop
  json.workshop do
    json.partial! 'api/workshops/workshop', workshop: @event.workshop
  end
end

# TODO - this is also in the partial. Need to unduplicate
json.can do
  json.update(can? :update, @event)
  json.destroy(can? :destroy, @event)
end