require 'test_helper'

class BibleBookTest < ActiveSupport::TestCase
  def setup
    I18n.locale = :en
  end
  test 'Relations' do
    @hdi_ezra = translation_activities(:HdiEzraActivity)
    @ezra = bible_books(:Ezra)
    assert_includes @ezra.translation_activities, @hdi_ezra
  end

  test 'Name' do
    @ezra = bible_books(:Ezra)
    assert_equal 'Ezra', @ezra.name
    I18n.locale = :fr
    assert_equal 'Esdras', @ezra.name
  end

  test 'testament getters' do
    assert_includes(BibleBook.get_old_testament, bible_books(:Genesis))
    assert_includes(BibleBook.get_old_testament, bible_books(:Ezra))
    assert_includes(BibleBook.get_new_testament, bible_books(:John))
  end

  test 'verse counters' do
    nt = BibleBook.verses_in_new_testament
    ot = BibleBook.verses_in_old_testament
    bible = BibleBook.verses_in_bible
    assert_equal(bible, nt + ot, 'Verses in Bible should match sum of NT and OT')
  end

  test "Options for Select" do
    options = BibleBook.options_for_select
    assert_equal(['New Testament', 'nt'], options[0])
    assert_equal('Genesis', options[2][0])
    assert_equal(BibleBook.all.count + 2, options.count)
  end
end
