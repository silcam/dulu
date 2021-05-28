# frozen_string_literal: true

json.tags [@tag] do |_tag|
  json.id _tag.id
  json.name _tag.tagname
end
