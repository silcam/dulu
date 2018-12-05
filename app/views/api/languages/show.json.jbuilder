json.language do
  json.call(@program, :id, :name)

  translation_activities = @program.translation_activities.order(:bible_book_id)
  json.partial! 'api/translation_activities/index', activities: translation_activities

  json.partial! 'api/media_activities/index', activities: @program.media_activities
  json.partial! 'api/research_activities/index', activities: @program.research_activities
  json.partial! 'api/workshops_activities/index', activities: @program.workshops_activities


  json.participants @program.all_current_participants do |participant|
    json.call(participant, :id, :full_name, :full_name_rev)

    json.program_id @program.id
    json.program_name @program.name
    if participant.cluster
      json.cluster_name participant.cluster.display_name
      json.cluster_id participant.cluster.id
    end

    json.roles participant.roles #.collect{ |role| t(role) })
  end

  json.events do
    json.current @program.all_events.current, partial: 'api/events/event', as: :event
    json.upcoming @program.all_events.upcoming, partial: 'api/events/event', as: :event
    json.past @program.all_events.past.limit(5), partial: 'api/events/event', as: :event
  end

  json.publications @program.publications.where(kind: [:Scripture, :Media]) do |pub|
    json.call(pub, :id, :name, :kind, :scripture_kind, :media_kind, :film_kind, :year)
  end

  json.loaded true

  json.can do
    json.update can?(:update_activities, @program)
    json.event do
      json.create can?(:create, Event)
    end
  end
end