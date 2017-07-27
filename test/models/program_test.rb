require 'test_helper'

class ProgramTest < ActiveSupport::TestCase
  def setup
    @hdi_program = programs :HdiProgram
  end

  test 'Relations' do
    hdi_ezra = translation_activities :HdiEzraActivity
    ezra = bible_books :Ezra
    drew_hdi = participants :DrewHdi
    drew = people :Drew
    hdi = languages :Hdi
    genesis_check = events :HdiGenesisChecking
    ewondo_program = programs :EwondoProgram
    ewondo_nt = publications :EwondoNT

    assert_includes @hdi_program.translation_activities, hdi_ezra
    assert_includes @hdi_program.bible_books, ezra
    assert_includes @hdi_program.participants, drew_hdi
    assert_includes @hdi_program.people, drew
    assert_equal hdi, @hdi_program.language
    assert_includes @hdi_program.events, genesis_check

    assert_includes ewondo_program.publications, ewondo_nt
  end

  test 'Unassociated People' do
    drew = people :Drew
    rick = people :Rick
    unassoc = @hdi_program.unassociated_people
    assert_includes unassoc, rick
    refute_includes unassoc, drew
  end

  test 'Name' do
    assert_equal 'Hdi', @hdi_program.name
  end

  test 'Latest Update' do
    assert_equal FuzzyDate.new(2017, 5, 29),
                 @hdi_program.latest_update
  end

  test 'Current Participants and People and Orgs' do
    drew_hdi = participants :DrewHdi
    drew = people :Drew
    former_hdi = participants :FormerHdiTranslator
    former = people :FormerHdiTranslator
    sil = organizations :SIL
    assert_includes @hdi_program.current_participants, drew_hdi
    refute_includes @hdi_program.current_participants, former_hdi
    assert_includes @hdi_program.current_people, drew
    refute_includes @hdi_program.current_people, former
    assert_includes @hdi_program.current_organizations, sil
    refute_includes @hdi_program.current_organizations, nil
  end

  test 'Sorted Activities' do
    ewondo_nt = publications :EwondoNT
    hdi_genesis = translation_activities :HdiGenesisActivity
    assert_equal hdi_genesis, @hdi_program.sorted_activities.first
  end

  test 'Sorted Pubs' do
    ewondo_program = programs :EwondoProgram
    ewondo_nt = publications :EwondoNT
    assert_includes ewondo_program.sorted_pubs('Bible'), ewondo_nt
  end

  test "Is translating" do
    ezra = bible_books :Ezra
    john = bible_books :John
    assert @hdi_program.is_translating?(ezra.id), "Hdi are translating Ezra"
    refute @hdi_program.is_translating?(john.id), "Hdi are not translating John"
  end

  test "Percentages" do
    percents = @hdi_program.percentages
    assert_in_delta 1.2, percents[:ot]['Drafting'], 0.1
    assert_in_delta 6.6, percents[:ot]['Consultant_check'], 0.1
  end

  # test "Current Events" do
  #   event_test_setup
  #   Date.stub(:today, Date.new(2017, 7, 26)) do
  #     refute_includes @hdi_program.current_events, @future_event
  #     refute_includes @hdi_program.current_events, @past_event
  #     assert_includes @hdi_program.current_events, @current_event
  #   end
  # end
  #
  # test "Upcoming Events" do
  #   event_test_setup
  #   Date.stub(:today, Date.new(2017, 7, 26)) do
  #     assert_includes @hdi_program.upcoming_events, @future_event
  #     refute_includes @hdi_program.upcoming_events, @past_event
  #     refute_includes @hdi_program.upcoming_events, @current_event
  #   end
  # end
  #
  # test "Past Events" do
  #   event_test_setup
  #   Date.stub(:today, Date.new(2017, 7, 26)) do
  #     assert_includes @hdi_program.past_events, @past_event
  #     refute_includes @hdi_program.past_events, @future_event
  #     refute_includes @hdi_program.past_events, @current_event
  #   end
  # end

  test "Events as hash" do
    event_test_setup
    Date.stub(:today, Date.new(2017, 7, 26)) do
      event_hash = @hdi_program.events_as_hash
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

  test "All Sorted" do
    ewondo = programs :EwondoProgram
    assert_equal ewondo, Program.all_sorted.first
  end

  test 'Programs Sorted by Recency' do
    no_activity = programs :NoActivityProgram
    really_old = programs :ReallyOldProgram

    programs = Program.all_sorted_by_recency
    assert_includes programs, @hdi_program
    assert_includes programs, no_activity
    assert_includes programs, really_old
    assert programs.index(@hdi_program) < programs.index(really_old),
           "Recent activity should come before old activity"
    assert programs.index(really_old) < programs.index(no_activity),
           "Old activity comes before no activity"
  end

  test 'Program Search' do
    results = Program.search('hdi')
    assert_equal 1, results.count
    assert_equal 'Hdi', results[0][:title]
    assert_equal "/programs/#{@hdi_program.id}/dashboard", results[0][:path]
  end
end
