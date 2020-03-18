# frozen_string_literal: true

notes = Note.for(@language)

json.languages [@language] do |language|
  json.call(language, :id, :name, :cluster_id, :region_id)
  json.code language.code_or_parent_code

  json.partial! 'api/notes/notes', notes: notes

  json.can do
    json.update_activities can?(:update_activities, language)
    json.manage_participants can?(:manage_participants, language)
    json.update can?(:update, language)
  end
end

json.partial! 'api/clusters/clusters', clusters: [@language.cluster] if @language.cluster

json.partial! 'api/regions/regions', regions: [@language.region] if @language.region

json.partial! 'api/people/people', people: Note.people(notes)
