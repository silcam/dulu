class AddClusterReferenceToParticipants < ActiveRecord::Migration[5.0]
  def change
    add_reference :participants, :cluster
  end
end
