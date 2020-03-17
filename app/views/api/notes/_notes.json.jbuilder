# frozen_string_literal: true

json.notes notes do |note|
  json.call(note, :id, :person_id, :text)
  json.updated_at note.updated_at.to_i * 1000
  json.can do
    json.update can? :update, note
  end
end
