if @event.workshop
  @event.workshop.reload
  json.workshop do
    json.partial! "api/workshops/workshop", workshop: @event.workshop
  end
end
