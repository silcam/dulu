require 'test_helper'

class EventTest < ActiveSupport::TestCase
  def setup
    @genesis_check = events :HdiGenesisChecking
    @hdi = programs :Hdi
    I18n.locale = :en
  end

  test "Relations" do
    drew_genesis_check = event_participants :DrewHdiGenesis
    drew = people :Drew

    assert_includes @genesis_check.programs, @hdi
    assert_includes @genesis_check.event_participants, drew_genesis_check
    assert_includes @genesis_check.people, drew
  end

  test "Presence Validation" do
    params = {domain: 'Translation', name: 'Taco Party', start_date: '2019-04', end_date: '2019-04'}
    model_validation_hack_test Event, params
  end

  test "Validate Domain" do
    assert_raises(Exception){ @genesis_check.update!(domain: 'NotARealKind') }
  end

  test "Validate Start Date Fuzzy Date" do
    refute @genesis_check.update(start_date: 'abc'), "Should not save with invalid start date"
  end

  test "Validate End Date not before Start Date" do
    refute @genesis_check.update(end_date: '2017-01'), "Should not save with end date before start date"
  end

  # test "Display Name" do
  #   hdi_past = events :HdiPastChecking
  #   assert_equal 'Hdi Genesis Checking', @genesis_check.display_name
  #   assert_equal 'Consultant Check', hdi_past.display_name
  # end

  test "F Dates" do
    assert_equal FuzzyDate.new(2018, 1, 15), @genesis_check.f_start_date
    assert_equal FuzzyDate.new(2018, 1, 30), @genesis_check.f_end_date
    assert_nil Event.new.f_start_date
    assert_nil Event.new.f_end_date
  end

  test "Unassoc Programs" do
    ewondo = programs :Ewondo
    unassoc = @genesis_check.unassoc_programs
    assert_includes unassoc, ewondo
    refute_includes unassoc, @hdi
  end

  test "Unassoc Clusters" do
    ndop = clusters :Ndop
    assert_includes @genesis_check.unassoc_clusters, ndop
    @genesis_check.clusters << ndop
    refute_includes @genesis_check.unassoc_clusters, ndop
  end

  test "Unassoc People" do
    rick = people :Rick
    drew = people :Drew
    unassoc = @genesis_check.unassoc_people
    assert_includes unassoc, rick
    refute_includes unassoc, drew
  end

  test "User Not Associated With Event" do
    rick = people :Rick
    refute @genesis_check.associated_with?(rick), "Rick is not associated with the event"
  end

  test "User Direct Association" do
    rick = people :Rick
    tc = program_roles :TranslationConsultant
    @genesis_check.event_participants << EventParticipant.new(person: rick, program_role: tc)
    assert @genesis_check.associated_with?(rick), "Rick is directly associated with the event"
  end

  test "User Program Association" do
    rick = people :Rick
    Participant.create(person: rick, program: @hdi, start_date: '2017')
    assert @genesis_check.associated_with?(rick), "Rick is associated with Event program"
  end

  test "Search" do
    results = Event.search 'genesis'
    exp = {
            title: 'Genesis Checking',
            description: 'Jan 15, 2018 to Jan 30, 2018 - Hdi',
            model: @genesis_check
          }
    assert_includes results, exp
  end

  test "Search query words separately" do
    results = Event.search 'checking genesis'
    assert results.any?{ |r| r[:title] == 'Genesis Checking' }
  end
end
