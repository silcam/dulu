class MigratePubsToDomainStatus1 < ActiveRecord::Migration[5.1]
  def up
    Publication.where(media_kind: :Video).each do |pub|
      if pub.film_kind == 'JesusFilm' || pub.film_kind == 'LukeFilm'
        DomainStatusItem.create!(
          language_id: pub.language_id, 
          category: 'Film', 
          subcategory: pub.film_kind,
          year: pub.year,
          platforms: '',
          creator_id: 1
        )
      elsif pub.english_name.include?('Acts')
        DomainStatusItem.create!(
          language_id: pub.language_id, 
          category: 'Film', 
          subcategory: 'ActsFilm',
          year: pub.year,
          platforms: '',
          creator_id: 1
        )
      end
    end

    luke = BibleBook.find_by(english_name: 'Luke')
    Publication.where(media_kind: :AudioScripture).each do |pub|
      item = DomainStatusItem.create!(
        language_id: pub.language_id, 
        category: 'AudioScripture', 
        subcategory: pub.scripture_kind,
        year: pub.year,
        platforms: '',
        creator_id: 1
      )
      if pub.scripture_kind == 'Portions' && pub.english_name.downcase.include?('luke')
        item.bible_books << luke
      end
    end

    books = BibleBook.all
    Publication.where(kind: :Scripture).each do |pub|
      item = DomainStatusItem.create!(
        language_id: pub.language_id, 
        category: 'PublishedScripture', 
        subcategory: pub.scripture_kind,
        year: pub.year,
        platforms: '',
        creator_id: 1
      )
      if pub.scripture_kind == 'Portions'
        books.each do |book|
          if pub.english_name.include?(book.english_name) || pub.french_name.include?(book.french_name)
            item.bible_books << book
          end
        end
      end
    end
  end
end
