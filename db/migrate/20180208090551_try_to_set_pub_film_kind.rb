class TryToSetPubFilmKind < ActiveRecord::Migration[5.0]
  def up
    Publication.where(media_kind: 'Video').each do |pub|
      if pub.english_name.downcase.include?('jesus film')
        pub.update(film_kind: 'JesusFilm')
      elsif pub.english_name.downcase.include?('luke film')
        pub.update(film_kind: 'LukeFilm')
      else
        pub.update(film_kind: 'Other')
      end
    end
  end
end
