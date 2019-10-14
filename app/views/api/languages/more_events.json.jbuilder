json.haveAllEvents @events.length < 16

events = @events.to_a.slice(0, 16)

json.events events, partial: "api/events/event", as: :event
