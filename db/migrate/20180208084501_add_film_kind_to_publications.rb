class AddFilmKindToPublications < ActiveRecord::Migration[5.0]
  def change
    add_column :publications, :film_kind, :string
  end
end
