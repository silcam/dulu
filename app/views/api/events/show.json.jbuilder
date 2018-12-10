json.event do
  json.partial! 'event', event: @event
end

json.can do
  json.update(can? :update, @event)
  json.destroy(can? :destroy, @event)
end