json.participants @participants, partial: 'participant', as: :participant

json.people @participants do |participant|
  json.call(participant.person, :id, :first_name, :last_name)
end

if @cluster_language.is_a? Language
  json.language do
    json.call(@cluster_language, :id, :name, :cluster_id)
    json.partial! 'api/languages/can', language: @cluster_language
  end

  if @cluster_language.cluster
    json.cluster do
      json.call(@cluster_language.cluster, :id, :name)
    end
  end
else
  json.cluster do
    json.call(@cluster_language, :id, :name)
  end
end
