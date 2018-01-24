class AdjustEnglishBibleBookNames < ActiveRecord::Migration[5.0]
  def up
    BibleBook.all.each do |book|
      name = book.english_name.gsub('First', '1').gsub('Second', '2').gsub('Third', '3')
      book.update(english_name: name) unless name == book.english_name
    end
  end

  def down
    BibleBook.all.each do |book|
      name = book.english_name.gsub('1', 'First').gsub('2', 'Second').gsub('3', 'Third')
      book.update(english_name: name) unless name == book.english_name
    end
  end
end
