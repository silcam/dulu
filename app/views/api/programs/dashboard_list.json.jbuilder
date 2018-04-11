if @participants
  cluster_participants = @participants.select{ |p| p.cluster_id }
  program_participants = @participants.select{ |p| p.program_id }
  json.user do
    json.name current_user.full_name
    json.clusters cluster_participants do |participant|
      json.(participant.cluster, :id)
      json.displayName participant.cluster.display_name
    end
    json.programs program_participants do |participant|
      json.(participant.program, :id, :name)
    end
  end
end
