class AddParentIdColumnToLanguages < ActiveRecord::Migration[5.0]
  def change
    add_reference :languages, :parent
  end
end
