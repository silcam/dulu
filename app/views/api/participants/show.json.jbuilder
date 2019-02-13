json.participant do
  json.partial! 'participant', participant: @participant

  json.can do
    json.update can?(:manage_participants, @participant.cluster_language)
    json.destroy can?(:manage_participants, @participant.cluster_language)
  end
end

json.person do
  json.call(@participant.person, :id, :first_name, :last_name)
end

json.activities @participant.activities do |activity|
  json.call(activity, 
            :id, 
            :type,
            :category,
            :language_id, 
            :bible_book_id, 
            :title, 
            :name, 
            :participant_ids)
  json.stage_name activity.current_stage.name
end

if @participant.language
  json.language do
    json.call(@participant.language, :id, :name)
  end
end

if @participant.cluster
  json.cluster do
    json.call(@participant.cluster, :id, :name)
  end
end