require 'test_helper'

class TranslationActivityTest < ActiveSupport::TestCase
  def setup
    @hdi_ezra = translation_activities :HdiEzra
    I18n.locale = :en
  end

  test "Name" do
    I18n.locale = :en
    assert_equal 'Ezra', @hdi_ezra.name
  end

  test "Next" do
    hdi_exodus = translation_activities :HdiExodus
    assert_equal @hdi_ezra, hdi_exodus.next
    assert_nil @hdi_ezra.next, "Next should return nil if there is no Next"
  end

  test "Prev" do
    hdi_genesis = translation_activities :HdiGenesis
    hdi_exodus = translation_activities :HdiExodus
    assert_equal hdi_exodus, @hdi_ezra.prev
    assert_nil hdi_genesis.prev, "Prev should return nil if there is no Prev"
  end

  test "Build One" do
    john = bible_books :John
    hdi = programs :Hdi
    drew_hdi = participants :DrewHdi
    params = {type: 'TranslationActivity', bible_book_id: john.id.to_s}
    participants = [drew_hdi]
    TranslationActivity.build(params, hdi, participants)
    hdi_john = TranslationActivity.last
    assert_equal john, hdi_john.bible_book
    assert_includes hdi_john.current_participants, drew_hdi
  end

  test "Repeat Build" do
    genesis = bible_books :Genesis
    hdi = programs :Hdi
    params = {type: 'TranslationActivity', bible_book_id: 'ot'}
    assert_equal 1, TranslationActivity.where(program: hdi, bible_book: genesis).count
    TranslationActivity.build(params, hdi, [])
    assert_equal 1, TranslationActivity.where(program: hdi, bible_book: genesis).count
  end

  test "Build All" do
    ewondo_program = programs :Ewondo
    params = {type: 'TranslationActivity', bible_book_id: 'ot'}
    TranslationActivity.build(params, ewondo_program,[])
    ezra = bible_books :Ezra
    genesis = bible_books :Genesis
    refute_nil ewondo_program.translation_activities.find_by(bible_book: ezra), "Should be an Ewondo Ezra Activity"
    refute_nil ewondo_program.translation_activities.find_by(bible_book: genesis), "Should be an Ewondo Genesis Activty"
  end

  test "Search" do
    t_acs = TranslationActivity.search('ezra')
    ezra_list = t_acs[t_acs.index{|r| r[:title]=='Ezra'}][:subresults]
    hdi_ezra_result = ezra_list[ezra_list.index{|r| r[:title]=='Hdi'}]
    refute_nil hdi_ezra_result
  end
end
