class AddFrenchNamesToBibleBooks < ActiveRecord::Migration[5.0]
  def change
    add_column :bible_books, :french_name, :string
    rename_column :bible_books, :name, :english_name

    books = BibleBook.all.order(:id)
    i = 0
    names_file = File.new("lib/csv_files/livres_de_la_bible.csv", 'r')
    names_file.each_line do |french_name|
      books[i].update french_name: french_name.chomp
      i+=1
    end
  end
end
