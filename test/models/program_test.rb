require 'test_helper'

class ProgramTest < ActiveSupport::TestCase
  def setup
    @hdi = programs :Hdi
    @drew_hdi = participants :DrewHdi

    @bangolan = programs :Bangolan
    @drew_ndop = participants :DrewNdop
    @freddie = participants :Freddie
  end

  test 'Relations' do
    hdi_ezra = translation_activities :HdiEzra
    ezra = bible_books :Ezra
    drew_hdi = participants :DrewHdi
    drew = people :Drew
    hdi = languages :Hdi
    genesis_check = events :HdiGenesisChecking
    ewondo_program = programs :Ewondo
    ewondo_nt = publications :EwondoNT

    assert_includes @hdi.translation_activities, hdi_ezra
    assert_includes @hdi.bible_books, ezra
    assert_includes @hdi.participants, drew_hdi
    assert_includes @hdi.people, drew
    assert_equal hdi, @hdi.language
    assert_includes @hdi.events, genesis_check

    assert_includes ewondo_program.publications, ewondo_nt
  end

  test 'Name' do
    assert_equal 'Hdi', @hdi.name
  end

  test 'All Participants' do
    ptcpts = @hdi.all_participants
    assert_includes ptcpts, @drew_hdi
    assert_includes ptcpts, participants(:FormerHdiTranslator)

    ptpcts = @bangolan.all_participants
    assert_includes ptpcts, @drew_ndop
    assert_includes ptpcts, @freddie
  end

  test 'All Current Participants' do
    ptcpts = @hdi.all_current_participants
    assert_includes ptcpts, @drew_hdi
    refute_includes ptcpts, participants(:FormerHdiTranslator)

    ptpcts = @bangolan.all_current_participants
    assert_includes ptpcts, @drew_ndop
    assert_includes ptpcts, @freddie
  end

  test 'All People' do
    ptcpts = @hdi.all_people
    assert_includes ptcpts, @drew_hdi.person
    assert_includes ptcpts, people(:FormerHdiTranslator)

    ptpcts = @bangolan.all_people
    assert_includes ptpcts, @drew_ndop.person
    assert_includes ptpcts, @freddie.person
  end

  test 'All Current People' do
    ptcpts = @hdi.all_current_people
    assert_includes ptcpts, @drew_hdi.person
    refute_includes ptcpts, people(:FormerHdiTranslator)

    ptpcts = @bangolan.all_current_people
    assert_includes ptpcts, @drew_ndop.person
    assert_includes ptpcts, @freddie.person
  end

  test 'Sorted Activities' do
    ewondo_nt = publications :EwondoNT
    hdi_genesis = translation_activities :HdiGenesis
    assert_equal hdi_genesis, @hdi.sorted_activities.first
  end

  test 'Sorted Pubs' do
    ewondo_program = programs :Ewondo
    ewondo_nt = publications :EwondoNT
    assert_includes ewondo_program.sorted_pubs('Scripture'), ewondo_nt
  end

  test "Is translating" do
    ezra = bible_books :Ezra
    john = bible_books :John
    assert @hdi.is_translating?(ezra.id), "Hdi are translating Ezra"
    refute @hdi.is_translating?(john.id), "Hdi are not translating John"
  end

  test "Percentages" do
    percents = @hdi.percentages
    percentage_assertions percents
  end

  def percentage_assertions(percents)
    assert_in_delta 1.2, percents[:ot][:Drafting], 0.1
    assert_in_delta 6.6, percents[:ot][:Consultant_check], 0.1
  end

  # test "Current Events" do
  #   event_test_setup
  #   Date.stub(:today, Date.new(2017, 7, 26)) do
  #     refute_includes @hdi.current_events, @future_event
  #     refute_includes @hdi.current_events, @past_event
  #     assert_includes @hdi.current_events, @current_event
  #   end
  # end
  #
  # test "Upcoming Events" do
  #   event_test_setup
  #   Date.stub(:today, Date.new(2017, 7, 26)) do
  #     assert_includes @hdi.upcoming_events, @future_event
  #     refute_includes @hdi.upcoming_events, @past_event
  #     refute_includes @hdi.upcoming_events, @current_event
  #   end
  # end
  #
  # test "Past Events" do
  #   event_test_setup
  #   Date.stub(:today, Date.new(2017, 7, 26)) do
  #     assert_includes @hdi.past_events, @past_event
  #     refute_includes @hdi.past_events, @future_event
  #     refute_includes @hdi.past_events, @current_event
  #   end
  # end

  test "Events as hash" do
    event_test_setup
    Date.stub(:today, Date.new(2017, 7, 26)) do
      event_hash = @hdi.events_as_hash
      assert_includes event_hash[:future], @future_event
      assert_includes event_hash[:past], @past_event
      assert_includes event_hash[:current], @current_event
      refute_includes event_hash[:future], @current_event
      refute_includes event_hash[:past], @current_event
      refute_includes event_hash[:current], @past_event
    end
  end

  def event_test_setup
    @future_event = events :HdiGenesisChecking
    @past_event = events :HdiPastChecking
    @current_event = events :HdiCurrentChecking
  end

  test "All Percentages" do
    percentages = Program.percentages
    percentage_assertions percentages[@hdi.id]
  end

  test "All Sorted" do
    first = programs :Bambalang
    assert_equal first, Program.all_sorted.first
  end

  test 'Programs Sorted by Recency' do
    no_activity = programs :NoActivityProgram
    really_old = programs :ReallyOldProgram

    programs = Program.all_sorted_by_recency
    assert_includes programs, @hdi
    assert_includes programs, no_activity
    assert_includes programs, really_old
    assert programs.index(@hdi) < programs.index(really_old),
           "Recent activity should come before old activity"
    assert programs.index(really_old) < programs.index(no_activity),
           "Old activity comes before no activity"
  end

  test 'Program Search' do
    results = Program.search('hdi')
    assert_equal 1, results.count
    assert_equal 'Hdi', results[0][:title]
    assert_equal @hdi, results[0][:model]
  end
end
