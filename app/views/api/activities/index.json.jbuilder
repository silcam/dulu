translation_activities = @language.translation_activities.order(:bible_book_id)
json.partial! 'api/translation_activities/index', activities: translation_activities

json.partial! 'api/media_activities/index', activities: @language.media_activities
json.partial! 'api/research_activities/index', activities: @language.research_activities
json.partial! 'api/workshops_activities/index', activities: @language.workshops_activities

json.language do
  json.id @language.id
  json.partial! 'api/languages/can', language: @language
end