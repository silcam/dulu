require 'test_helper'

class MediaActivityTest < ActiveSupport::TestCase
  def setup
    @hdi = programs(:Hdi)
    @drew_hdi = participants(:DrewHdi)
  end

  test "Build Jesus Film" do
    params = ActionController::Parameters.new category: 'Film', film: 'JesusFilm'
    participants = [@drew_hdi]
    MediaActivity.build(params, @hdi, participants)
    film = MediaActivity.order('id').last
    assert_equal :Film, film.category
    assert_equal :JesusFilm, film.film
    assert_equal @hdi, film.program
    assert_includes film.participants, @drew_hdi
  end

  test "Jesus Film no Participants" do
    params = ActionController::Parameters.new category: 'Film', film: 'JesusFilm'
    participants = []
    MediaActivity.build(params, @hdi, participants)
    film = MediaActivity.order('id').last
    assert_equal :Film, film.category
    assert_equal :JesusFilm, film.film
    assert_equal @hdi, film.program
    assert_empty film.participants
  end

  test "Create some Audio Scripture" do
    params = ActionController::Parameters.new category: 'AudioScripture', scripture: 'New_testament'
    MediaActivity.build(params, @hdi, [])
    audio = MediaActivity.order('id').last
    assert_equal :AudioScripture, audio.category
    assert_equal :New_testament, audio.scripture
    assert_equal @hdi, audio.program
  end

  test "Create Audio Genesis-Exodus" do
    params = ActionController::Parameters.new category: 'AudioScripture', scripture: 'Other'
    params[:bible_book_ids] = [:Genesis, :Exodus].collect{ |b| bible_books(b).id }
    MediaActivity.build(params, @hdi, [])
    audio = MediaActivity.order('id').last
    assert_equal 2, audio.bible_books.length
    assert_includes audio.bible_books, bible_books(:Genesis)
  end
end