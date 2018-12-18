# Locals: cluster

json.call(cluster, :id, :name)

percents = Program.percentages(cluster.programs)

json.languages cluster.languages do |language|
  json.call(language, :id, :name)
  json.program_id language.program.id
  json.progress percents[language.program.id]
end

json.participants cluster.participants, partial: 'api/participants/participant', as: :participant

json.can do
  json.update can?(:update, cluster)
  json.destroy can?(:destroy, cluster)
  json.manage_participants can?(:manage_participants, cluster)
end

json.loaded true