class AddUsfmNumberToBibleBook < ActiveRecord::Migration[5.0]
  def up
    add_column :bible_books, :usfm_number, :integer

    BibleBook.all.each do |book|
      book.usfm_number = book.id
      book.usfm_number += 1 if book.id > 39 #USFM skips 40 and starts NT at 41
      book.save
    end
  end

  def down
    remove_column :bible_books, :usfm_number
  end
end
