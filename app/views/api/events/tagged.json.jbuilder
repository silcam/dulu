# frozen_string_literal: true

language_ids = []
cluster_ids = []
person_ids = []

json.events @events do |event|
  json.call(event, :id, :name, :start_date, :end_date, :domain, :note, :language_ids, :cluster_ids, :tag_ids, :category, :subcategory)

  json.location { json.call(event.event_location, :id, :name) } if event.event_location

  json.tags event.tags do |t|
    json.id t.id
    json.name t.tagname
  end

  json.event_participants event.event_participants do |e_p|
    json.call(e_p, :id, :person_id, :roles)
    person_ids << e_p.person_id
  end

  language_ids += event.language_ids
  cluster_ids += event.cluster_ids
end

json.startYear @start_year

json.languages Language.where(id: language_ids) do |language|
  json.call(language, :id, :name)
end

json.clusters Cluster.where(id: cluster_ids) do |cluster|
  json.call(cluster, :id, :name)
end

json.people Person.where(id: person_ids) do |person|
  json.call(person, :id, :first_name, :last_name)
end

json.can do
  json.events do
    json.create can?(:create, Event)
  end
end
