# locals: language
#   optional: can_update

json.call(language, :id, :name)

translation_activities = language.translation_activities.order(:bible_book_id)
json.translation_activities translation_activities do |activity|
  json.call(activity, :id, :name, :language_id, :bible_book_id)

  json.language_name language.name
  json.stage_name t(activity.stage_name)
  json.last_update activity.updated_at

  json.progress do
    percent, color = activity.progress
    json.percent percent
    json.color color_from_sym(color)
  end
end

research_activities = language.linguistic_activities.where(category: :Research)
workshops_activities = language.linguistic_activities.where(category: :Workshops)
json.linguistic_activities do
  json.research_activities research_activities do |activity|
    json.call(activity, :id, :title, :language_id, :stage_name)
    json.language_name activity.language.name
    json.last_update activity.updated_at
    json.progress do
      percent, color = activity.progress
      json.percent percent
      json.color color_from_sym(color)
    end
  end

  json.workshops_activities workshops_activities do |activity|
    json.call(activity, :id, :title, :language_id)
    json.language_name activity.language.name
    json.last_update activity.updated_at
    json.workshops activity.workshops do |workshop|
      json.call(workshop, :id, :name, :event_id)
      json.completed workshop.completed?
    end
  end
end

json.media_activities language.media_activities do |activity|
  json.call(activity, :id, :name, :language_id)
  json.language_name language.name
  json.stage_name t(activity.stage_name)
  json.last_update activity.updated_at

  json.progress do
    percent, color = activity.progress
    json.percent percent
    json.color color_from_sym(color)
  end
end

json.participants language.all_current_participants do |participant|
  json.call(participant, :id, :full_name, :full_name_rev)

  json.language_id language.id
  json.language_name language.name
  if participant.cluster
    json.cluster_name participant.cluster.display_name
    json.cluster_id participant.cluster.id
  end

  json.roles(participant.roles.collect{ |role| t(role) })
end

current_events = language.all_events.current.uniq
upcoming_events = language.all_events.upcoming.uniq
json.events do
  json.current current_events, partial: 'api/languages/event', as: :event, locals: {language: language}
  json.upcoming upcoming_events, partial: 'api/languages/event', as: :event, locals: {language: language}
end

json.can do
  json.update defined?(can_update) ? can_update : can?(:update_activities, language)
end
