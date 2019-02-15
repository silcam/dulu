# Locals: cluster

# json.call(cluster, :id, :name)

# percents = Language.percentages(cluster.languages)

# json.languages cluster.languages do |language|
#   json.call(language, :id, :name)
#   json.language_id language.id
#   json.progress percents[language.id]
# end

# json.participants cluster.participants, partial: 'api/participants/participant', as: :participant

# json.can do
#   json.update can?(:update, cluster)
#   json.destroy can?(:destroy, cluster)
#   json.manage_participants can?(:manage_participants, cluster)
# end
