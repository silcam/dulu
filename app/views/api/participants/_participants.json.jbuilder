# frozen_string_literal: true

json.participants participants do |participant|
  json.call(participant, :id, :roles, :start_date, :end_date, :person_id, :language_id, :cluster_id)
end
