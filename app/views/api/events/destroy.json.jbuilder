# frozen_string_literal: true

json.partial! 'api/activities/activity', activity: @event.workshop.linguistic_activity if @event.workshop
 
json.deletedEvents [@event.id]
