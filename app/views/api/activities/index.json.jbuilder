def check_domain(domain)
  return @domain == 'all' || @domain == domain
end

if check_domain('translation')
  translation_activities = @language.translation_activities.order(:bible_book_id)
  json.partial! 'api/translation_activities/index', activities: translation_activities
end

if check_domain('media')
  json.partial! 'api/media_activities/index', activities: @language.media_activities
end

if check_domain('linguistic')
  json.partial! 'api/research_activities/index', activities: @language.research_activities
  json.partial! 'api/workshops_activities/index', activities: @language.workshops_activities
end

json.language do
  json.id @language.id
  json.partial! 'api/languages/can', language: @language
end