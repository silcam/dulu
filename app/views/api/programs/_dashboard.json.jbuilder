# locals: program
#   optional: can_update

json.(program, :id, :name)

translation_activities = program.translation_activities.order(:bible_book_id)
json.translation_activities translation_activities do |activity|
  json.(activity, :id, :name)
  
  json.bibleBookId activity.bible_book_id
  json.stageName t(activity.stage_name)

  json.progress do
    percent, color = activity.progress
    json.percent percent
    json.color color_from_sym(color)
  end
end

json.can do
  json.update defined?(can_update) ? can_update : can?(:update_activities, program)
end