class RemoveKindFromEvents < ActiveRecord::Migration[5.0]
  def change
    remove_column :events, :kind, :integer
  end
end
