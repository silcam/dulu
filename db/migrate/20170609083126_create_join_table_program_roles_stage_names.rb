class CreateJoinTableProgramRolesStageNames < ActiveRecord::Migration[5.0]
  def change
    create_table :program_roles_stage_names do |t|
      t.references :program_role
      t.references :stage_name
    end
  end
end
