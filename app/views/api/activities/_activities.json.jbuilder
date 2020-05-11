# frozen_string_literal: true

json.activities activities do |activity|
  json.call(activity,
            :id,
            :type,
            :category,
            :language_id,
            :bible_book_id,
            :title,
            :participant_ids, 
            :scripture, 
            :film)
  json.name activity.name unless activity.is_a? MediaActivity
  json.stage_name activity.current_stage.name
  json.stage_date activity.current_stage.start_date

  # This might seem excessive. Removing it would require refactor of ActivityRow component
  json.workshops Workshop.sort(activity.workshops), partial: 'api/workshops/workshop', as: :workshop if activity.category == :Workshops
end
