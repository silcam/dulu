class DowncaseStageNameTypes < ActiveRecord::Migration[5.0]
  def up
    StageName.all.each{ |stage| stage.update(kind: stage.kind.downcase)}
  end

  def down
    StageName.all.each{ |stage| stage.update(kind: stage.kind.camelize)}
  end
end
