  json.pubs @language.publications.where(kind: [:Scripture, :Media]) do |pub|
    json.call(pub, :id, :name, :kind, :scripture_kind, :media_kind, :film_kind, :year)
  end

  json.language do
    json.call(@language, :id, :name)
  end