class AddProgramRolesClusterFacilitatorLiteracySpecialistScriptureEngagementSpecialist < ActiveRecord::Migration[5.0]
  def up
    roles.each do |role|
      ProgramRole.create! name: role
    end
  end

  def down
    roles.each do |role|
      ProgramRole.find_by(name: role).try(:destroy)
    end
  end

  def roles
    %w[Cluster_facilitator Literacy_specialist Scripture_engagement_specialist]
  end
end
