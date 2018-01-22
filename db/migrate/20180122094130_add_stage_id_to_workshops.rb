class AddStageIdToWorkshops < ActiveRecord::Migration[5.0]
  def change
    add_reference :workshops, :stage
  end
end
