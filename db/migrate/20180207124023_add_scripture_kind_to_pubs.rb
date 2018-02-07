class AddScriptureKindToPubs < ActiveRecord::Migration[5.0]
  def change
    add_column :publications, :scripture_kind, :string
  end
end
