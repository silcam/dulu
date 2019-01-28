json.reports @reports do |report|
  json.call(report, :id, :name)
end