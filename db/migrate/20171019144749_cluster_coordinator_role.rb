class ClusterCoordinatorRole < ActiveRecord::Migration[5.0]
  def up
    ProgramRole.create! name: 'Cluster_coordinator'
  end
end
