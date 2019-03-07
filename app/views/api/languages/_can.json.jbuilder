# Locals: language

json.can do
  json.update_activities can?(:update_activities, language)
  json.manage_participants can?(:manage_participants, language)
  json.update can?(:update, language)
end