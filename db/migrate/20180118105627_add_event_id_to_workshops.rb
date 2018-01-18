class AddEventIdToWorkshops < ActiveRecord::Migration[5.0]
  def change
    add_reference :workshops, :event
  end
end
