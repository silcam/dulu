# Locals: org

json.call(org, :id, :short_name, :long_name, :description, :parent_id)

if org.country
  json.country do
    json.call(org.country, :id, :name)
  end
else
  json.country nil
end

json.can do
  json.update can?(:update, org)
  json.destroy can?(:destroy, org)
end
