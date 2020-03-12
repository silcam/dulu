# frozen_string_literal: true

json.notes notes do |note|
  json.call(note, :id, :person_id, :text)
  json.created_at note.created_at.to_i
end
