# frozen_string_literal: true

require 'test_helper'

class MediaActivityTest < ActiveSupport::TestCase
  include TranslationHelper

  def setup
    @hdi = languages(:Hdi)
    @drew_hdi = participants(:DrewHdi)
  end

  test 'Build Jesus Film' do
    params = ActionController::Parameters.new category: 'Film', film: 'JesusFilm'
    participants = [@drew_hdi]
    MediaActivity.build(params, @hdi, participants)
    film = MediaActivity.order('id').last
    assert_equal :Film, film.category
    assert_equal :JesusFilm, film.film
    assert_equal @hdi, film.language
    assert_includes film.participants, @drew_hdi
    assert_equal t_params(:JesusFilm), film.t_name
  end

  test 'Jesus Film no Participants' do
    params = ActionController::Parameters.new category: 'Film', film: 'JesusFilm'
    participants = []
    MediaActivity.build(params, @hdi, participants)
    film = MediaActivity.order('id').last
    assert_equal :Film, film.category
    assert_equal :JesusFilm, film.film
    assert_equal @hdi, film.language
    assert_empty film.participants
  end

  test 'Create some Audio Scripture' do
    params = ActionController::Parameters.new category: 'AudioScripture', scripture: 'New_testament'
    MediaActivity.build(params, @hdi, [])
    audio = MediaActivity.order('id').last
    assert_equal :AudioScripture, audio.category
    assert_equal :New_testament, audio.scripture
    assert_equal @hdi, audio.language
    assert_equal t_params(:Audio_x, x: t_params(:New_testament)), audio.t_name
  end

  test 'Create Audio Genesis-Exodus' do
    params = ActionController::Parameters.new category: 'AudioScripture', scripture: 'Other'
    params[:bible_book_ids] = %i[Genesis Exodus].collect { |b| bible_books(b).id }
    MediaActivity.build(params, @hdi, [])
    audio = MediaActivity.order('id').last
    assert_equal 2, audio.bible_books.length
    assert_includes audio.bible_books, bible_books(:Genesis)
    assert_equal t_params(:AudioScripture), audio.t_name
  end
end
