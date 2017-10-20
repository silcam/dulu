class AddMediaKindColumnToPublications < ActiveRecord::Migration[5.0]
  def change
    add_column :publications, :media_kind, :string
  end
end
