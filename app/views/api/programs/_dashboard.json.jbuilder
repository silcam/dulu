# locals: program
#   optional: can_update

json.call(program, :id, :name)

translation_activities = program.translation_activities.order(:bible_book_id)
json.translation_activities translation_activities do |activity|
  json.call(activity, :id, :name)

  json.programId program.id
  json.programName program.name
  json.bibleBookId activity.bible_book_id
  json.stageName t(activity.stage_name)
  json.lastUpdate activity.updated_at

  json.progress do
    percent, color = activity.progress
    json.percent percent
    json.color color_from_sym(color)
  end
end

json.participants program.all_current_participants do |participant|
  json.call(participant, :id)
  json.fullName participant.full_name
  json.fullNameRev participant.full_name_rev

  json.programId program.id
  json.programName program.name
  if participant.cluster
    json.clusterName participant.cluster.display_name
    json.clusterId participant.cluster.id
  end

  json.roles(participant.roles.collect{ |role| t(role) })
end

current_events = program.all_events.current.uniq
upcoming_events = program.all_events.upcoming.uniq
json.events do
  json.current current_events, partial: 'api/programs/event', as: :event, locals: {program: program}
  json.upcoming upcoming_events, partial: 'api/programs/event', as: :event, locals: {program: program}
end

json.can do
  json.update defined?(can_update) ? can_update : can?(:update_activities, program)
end
