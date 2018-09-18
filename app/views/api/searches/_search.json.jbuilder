# Locals: results

json.array! results do |result|
  json.title result[:title]
  json.description result[:description]

  if result[:route]
    json.route result[:route]
  elsif result[:model]
    json.route model_path(result[:model])
  end
  
  if result[:subresults]
    json.subresults do
      json.partial! 'search', results: result[:subresults]
    end
  end
end