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
    ewondo_program = programs :EwondoProgram
    ewondo_nt = publications :EwondoNT

    assert_includes @hdi_program.translation_activities, hdi_ezra
    assert_includes @hdi_program.bible_books, ezra
    assert_includes @hdi_program.participants, drew_hdi
    assert_includes @hdi_program.people, drew
    assert_equal hdi, @hdi_program.language

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

  test 'Sorted Programs' do
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
