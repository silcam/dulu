class DropProgramsSurveysTable < ActiveRecord::Migration[5.0]
  def change
    drop_join_table :programs, :surveys
  end
end
