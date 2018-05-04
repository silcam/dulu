json.organization do
  json.partial! 'org', org: @org
end

json.can do
  json.update can?(:update, @org)
  json.destroy can?(:destroy, @org)
end