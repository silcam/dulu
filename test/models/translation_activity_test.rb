require 'test_helper'

class TranslationActivityTest < ActiveSupport::TestCase
  def setup
    @hdi_ezra = translation_activities :HdiEzraActivity
  end

  test "Name" do
    I18n.locale = :en
    assert_equal 'Ezra', @hdi_ezra.name
  end

  test "Valid Build" do
    john = bible_books :John
    hdi_program = programs :HdiProgram
    drafting = stage_names :Drafting
    drew_hdi = participants :DrewHdi
    params = {type: 'TranslationActivity', bible_book: john.id.to_s,
              stage_name_id: drafting.id.to_s, stage_start_date: '2017',
              participant_ids: [drew_hdi.id.to_s]}
    TranslationActivity.new(program: hdi_program).build(params)
    hdi_john = TranslationActivity.last
    assert_equal john, hdi_john.bible_book
    assert_includes hdi_john.current_participants, drew_hdi
    john_stage = hdi_john.current_stage
    assert_equal drafting, john_stage.stage_name
    assert_equal '2017', john_stage.start_date
  end

  test "Repeat Build" do
    genesis = bible_books :Genesis
    hdi_program = programs :HdiProgram
    planned = stage_names :Planned
    params = {type: 'TranslationActivity', bible_book: genesis.id.to_s,
              stage_name_id: planned.id.to_s, stage_start_date: '2017'}
    assert_equal 1, TranslationActivity.where(program: hdi_program, bible_book: genesis).count
    number_of_stages = Stage.all.count
    TranslationActivity.new(program: hdi_program).build(params)
    assert_equal 1, TranslationActivity.where(program: hdi_program, bible_book: genesis).count
    assert_equal number_of_stages, Stage.all.count
  end

  test "Invalid Build" do
    john = bible_books :John
    hdi_program = programs :HdiProgram
    planned = stage_names :Planned
    params = {type: 'TranslationActivity', bible_book: john.id.to_s,
              stage_name_id: planned.id.to_s, stage_start_date: ''}
    john_activity = TranslationActivity.new(program: hdi_program)
    number_of_stages = Stage.all.count
    number_of_activities = Activity.all.count
    assert_raises(ActiveRecord::RecordInvalid){ john_activity.build(params)}
    assert_equal number_of_stages, Stage.all.count
    assert_equal number_of_activities, Activity.all.count
  end

  test "Build All" do
    ewondo_program = programs :EwondoProgram
    drafting = stage_names :Drafting
    params = {type: 'TranslationActivity', bible_book: 'ot',
              stage_name_id: drafting.id.to_s, stage_start_date: '2016-01-01'}
    TranslationActivity.build_all(ewondo_program, params)
    ezra = bible_books :Ezra
    genesis = bible_books :Genesis
    refute_nil ewondo_program.activities.find_by(bible_book: ezra), "Should be an Ewondo Ezra Activity"
    refute_nil ewondo_program.activities.find_by(bible_book: genesis), "Should be an Ewondo Genesis Activty"
  end

  test "Search" do
    t_acs = TranslationActivity.search('ezra')
    ezra_list = t_acs[t_acs.index{|r| r[:title]=='Ezra'}][:subresults]
    hdi_ezra_result = ezra_list[ezra_list.index{|r| r[:title]=='Hdi'}]
    refute_nil hdi_ezra_result
  end
end
