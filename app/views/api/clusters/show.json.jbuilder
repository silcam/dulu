json.cluster do
  json.call(@cluster, :id, :name, :region_id)

  json.can do
    json.update can?(:update, @cluster)
    json.destroy can?(:destroy, @cluster)
    json.manage_participants can?(:manage_participants, @cluster)
  end
end

percents = Language.percentages(@cluster.languages)

languages = @old_languages ?
  (@cluster.languages + @old_languages).uniq :
  @cluster.languages

json.languages languages do |language|
  json.call(language, :id, :name, :cluster_id)
  json.progress percents[language.id]
end

# json.participants @cluster.participants do |participant|
#   json.call(participant, :id, :person_id, :cluster_id)
# end

# json.people @cluster.people do |person|
#   json.call(person, :id, :first_name, :last_name)
# end
