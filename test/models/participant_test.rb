require 'test_helper'

class ParticipantTest < ActiveSupport::TestCase
  def setup
    @drew_hdi = participants :DrewHdi
    @hdi_program = programs(:HdiProgram)
    @drew = people :Drew
  end

  test 'Relations' do
    consultant = program_roles :TranslationConsultant
    hdi_ezra = translation_activities :HdiEzraActivity
    assert_equal @drew, @drew_hdi.person
    assert_equal @hdi_program, @drew_hdi.program
    assert_equal consultant, @drew_hdi.program_role
    assert_includes @drew_hdi.activities, hdi_ezra
  end

  test 'Participant Validations' do
    rick = people(:Rick)
    role = program_roles(:Translator)
    params = {person: rick, program: @hdi_program,
              program_role: role, start_date: '2017'}
    model_validation_hack_test(Participant, params)
  end

  test 'End Date Validation' do
    rick = people :Rick
    role = program_roles :Translator
    participant = Participant.new(person: rick, program: @hdi_program,
                    program_role: role, start_date: '2017',
                                  end_date: 'abc')
    refute participant.save, "Should not save with invalid end date"
    participant.end_date = '2017'
    assert participant.save, "Should save with valid end date"
  end

  test 'Disassociate All Activities' do
    assert_not_empty @drew_hdi.activities
    @drew_hdi.associate_activities nil
    assert_empty @drew_hdi.activities
  end

  test 'Associate Activities' do
    hdi_ezra = translation_activities :HdiEzraActivity
    hdi_genesis = translation_activities :HdiGenesisActivity
    assert_includes @drew_hdi.activities, hdi_ezra
    refute_includes @drew_hdi.activities, hdi_genesis

    @drew_hdi.associate_activities [hdi_genesis.id]
    assert_includes @drew_hdi.activities, hdi_genesis
    refute_includes @drew_hdi.activities, hdi_ezra
  end

  test 'Full name' do
    assert_equal 'Drew Maust', @drew_hdi.full_name
  end

  test 'Fuzzy Dates' do
    drew_start = FuzzyDate.new 2017, 1, 1
    olga_hdi = participants :OlgaHdi
    olga_start = FuzzyDate.new 2010
    abanda_hdi = participants :AbandaHdi
    abanda_start = FuzzyDate.new 2015, 5
    former_hdi = participants :FormerHdiTranslator
    former_quit = FuzzyDate.new 2015, 3

    assert_equal drew_start, @drew_hdi.f_start_date
    assert_equal olga_start, olga_hdi.f_start_date
    assert_equal abanda_start, abanda_hdi.f_start_date

    assert_nil @drew_hdi.f_end_date
    assert_equal former_quit, former_hdi.f_end_date
  end

  test 'Sorted Activities' do
    abanda_hdi = participants :AbandaHdi
    genesis = bible_books :Genesis
    assert_equal genesis, abanda_hdi.sorted_activities.first.bible_book
  end
end
