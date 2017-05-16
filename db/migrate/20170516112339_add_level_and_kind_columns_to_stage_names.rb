class AddLevelAndKindColumnsToStageNames < ActiveRecord::Migration[5.0]
  def change
    add_column :stage_names, :level, :integer
    add_column :stage_names, :kind, :string

    StageName.all.each do |stagename|
      stagename.level = stagename.id
      stagename.kind = 'Translation'
      stagename.save
    end
  end
end
