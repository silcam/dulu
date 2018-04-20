participants = current_user.participants
cluster_participants = participants.select { |p| p.cluster_id }
program_participants = participants.select { |p| p.program_id }

user_lpf = current_user.lpfs.first

json.user do
  json.name current_user.full_name
  json.startExpanded true
  json.startSelected true unless user_lpf

  json.clusters cluster_participants do |participant|
    json.call(participant.cluster, :id)
    json.displayName participant.cluster.display_name
    json.programs participant.cluster.programs do |program|
      json.call(program, :id, :name)
    end
  end
  json.programs program_participants do |participant|
    json.call(participant.program, :id, :name)
  end
end

# participant_cluster_ids = cluster_participants.collect{ |p| p.cluster_id }
# participant_program_ids = program_participants.collect{ |p| p.program_id }
# other_clusters = Cluster.where.not(id: participant_cluster_ids)
# other_programs = Program.includes(:language).where("languages.cluster_id IS NULL").where.not(id: participant_program_ids)

user_countries = [Country.find_by(english_name: 'Cameroon')]
json.countries user_countries do |country|
  json.call(country, :id, :name)
  json.startExpanded true

  lpfs = Lpf.all
  json.sections lpfs do |lpf|
    json.call(lpf, :id, :name)
    json.startSelected true if lpf == user_lpf

    json.clusters lpf.clusters do |cluster|
      json.call(cluster, :id)
      json.displayName cluster.display_name
      json.programs cluster.programs do |program|
        json.call(program, :id, :name)
      end
    end
    json.programs lpf.programs do |program|
      json.call(program, :id, :name)
    end
  end
end
