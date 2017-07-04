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

    assert_includes @hdi_program.translation_activities, hdi_ezra
    assert_includes @hdi_program.bible_books, ezra
    assert_includes @hdi_program.participants, drew_hdi
    assert_includes @hdi_program.people, drew
    assert_equal hdi, @hdi_program.language
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
    hdi_genesis = translation_activities :HdiGenesisActivity
    assert_equal hdi_genesis, @hdi_program.sorted_activities.first
  end
end
