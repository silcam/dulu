class UnaccentedSearch < ActiveRecord::Migration[5.0]
  def change
    # If this migration fails, it's letting you know that you need
    # to install the unaccent postgres module as a postgres superuser :
    #
    # psql dulu
    # CREATE EXTENSION "unaccent";

    enable_extension 'unaccent'
  end
end
