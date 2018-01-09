class ExtractStageNames < ActiveRecord::Migration[5.0]
  def up
    StageName.all.each do |stage_name|
      stage_name.stages.update(name: stage_name.name, kind: stage_name.kind.camelize)
    end
  end
end
