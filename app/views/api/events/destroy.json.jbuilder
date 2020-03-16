# frozen_string_literal: true

json.partial! 'api/workshops_activities/index', activities: [@event.workshop.linguistic_activity] if @event.workshop
 
json.deletedEvents [@event.id]
