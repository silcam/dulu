json.activities do
  json.array! @activities do |activity|
    json.(activity, :id, :name)
    
    json.bibleBookId activity.bible_book_id
    json.stageName t(activity.stage_name)

    json.progress do
      percent, color = activity.progress
      json.percent percent
      json.color color_from_sym(color)
    end
  end
end

json.can do
  json.update can?(:update_activities, @program)
end