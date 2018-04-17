participants = current_user.participants
cluster_participants = participants.select{ |p| p.cluster_id }
program_participants = participants.select{ |p| p.program_id }

json.user do
  json.name current_user.full_name
  json.clusters cluster_participants do |participant|
    json.(participant.cluster, :id)
    json.displayName participant.cluster.display_name
    json.programs participant.cluster.programs do |program|
      json.(program, :id, :name)
    end
  end
  json.programs program_participants do |participant|
    json.(participant.program, :id, :name)
  end
end

participant_cluster_ids = cluster_participants.collect{ |p| p.cluster_id }
participant_program_ids = program_participants.collect{ |p| p.program_id }
# other_clusters = Cluster.where.not(id: participant_cluster_ids)
# other_programs = Program.includes(:language).where("languages.cluster_id IS NULL").where.not(id: participant_program_ids)
lpfs = Lpf.all

json.other do
  json.lpfs lpfs do |lpf|
    json.(lpf, :id, :name)

    json.clusters lpf.clusters do |cluster|
      json.(cluster, :id)
      json.displayName cluster.display_name
      json.programs cluster.programs do |program|
        json.(program, :id, :name)
      end
    end
    json.programs lpf.programs do |program|
      json.(program, :id, :name)
    end
  end
end

