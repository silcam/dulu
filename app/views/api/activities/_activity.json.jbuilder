# frozen_string_literal: true

json.activities [activity] do |activity|
  json.call(activity,
            :id,
            :bible_book_id,
            :type,
            :category,
            :title,
            :scripture,
            :film,
            :participant_ids,
            :stage_name,
            :language_id)
  json.bible_book_ids activity.bible_book_ids if activity.type == 'MediaActivity'
  json.stage_date activity.current_stage.start_date

  json.stages activity.stages.order(start_date: :desc) do |stage|
    json.call(stage, :id, :name, :start_date, :activity_id)
  end

  json.can do
    json.update can?(:update, activity)
  end

  json.workshops Workshop.sort(activity.workshops), partial: 'api/workshops/workshop', as: :workshop if activity.category == :Workshops
end

json.partial! 'api/languages/languages', languages: [activity.language]
json.partial! 'api/participants/participants', participants: activity.participants
json.partial! 'api/people/people', people: activity.people
