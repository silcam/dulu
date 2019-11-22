# frozen_string_literal: true

require 'test_helper'

class ParticipantTest < ActiveSupport::TestCase
  def setup
    @drew_hdi = participants :DrewHdi
    @hdi_language = languages(:Hdi)
    @drew = people :Drew
  end

  test 'Relations' do
    hdi_ezra = translation_activities :HdiEzra
    assert_equal @drew, @drew_hdi.person
    assert_equal @hdi_language, @drew_hdi.language
    assert_includes @drew_hdi.activities, hdi_ezra
  end

  test 'Participant Validations' do
    model_validation_hack_test(Participant, some_valid_params)
  end

  test 'Valid if belongs to cluster' do
    params = some_valid_params language: nil, cluster: clusters(:Ndop)
    assert Participant.new(params).valid?
  end

  test 'Invalid if neither language nor cluster' do
    params = some_valid_params language: nil
    refute Participant.new(params).valid?
  end

  test 'End Date Validation' do
    rick = people :Rick
    participant = Participant.new(person: rick, language: @hdi_language,
                                  start_date: '2017', end_date: 'abc')
    refute participant.save, 'Should not save with invalid end date'
    participant.end_date = '2017'
    assert participant.save, 'Should save with valid end date'
  end

  test 'Disassociate All Activities' do
    assert_not_empty @drew_hdi.activities
    @drew_hdi.associate_activities nil
    assert_empty @drew_hdi.activities
  end

  test 'Associate Activities' do
    hdi_ezra = translation_activities :HdiEzra
    hdi_genesis = translation_activities :HdiGenesis
    assert_includes @drew_hdi.activities, hdi_ezra
    refute_includes @drew_hdi.activities, hdi_genesis

    @drew_hdi.associate_activities [hdi_genesis.id]
    assert_includes @drew_hdi.activities, hdi_genesis
    refute_includes @drew_hdi.activities, hdi_ezra
  end

  test 'Full name' do
    assert_equal 'Drew Mambo', @drew_hdi.full_name
  end

  test 'Fuzzy Dates' do
    drew_start = FuzzyDate.new 2017, 1, 1
    abanda_hdi = participants :AbandaHdi
    abanda_start = FuzzyDate.new 2015, 5
    former_hdi = participants :FormerHdiTranslator
    former_quit = FuzzyDate.new 2015, 3

    assert_equal drew_start, @drew_hdi.f_start_date
    assert_equal abanda_start, abanda_hdi.f_start_date

    assert_nil @drew_hdi.f_end_date
    assert_equal former_quit, former_hdi.f_end_date
  end

  test 'Sorted Activities' do
    abanda_hdi = participants :AbandaHdi
    genesis = bible_books :Genesis
    assert_equal genesis, abanda_hdi.sorted_activities.first.bible_book
  end

  test 'Unassoc Activities' do
    unassoc = @drew_hdi.unassoc_activities
    assert_includes unassoc, translation_activities(:HdiGenesis)
    refute_includes unassoc, translation_activities(:HdiEzra)
  end

  test 'Subscribes person to notification channel on create' do
    lance = people(:Lance)
    ndop = clusters(:Ndop)
    Participant.create(person: lance, cluster: ndop, start_date: '2019-11')
    lance.reload
    assert_includes(
      lance.notification_channels,
      NotificationChannel.cluster_channel(ndop.id)
    )

    ewondo = languages(:Ewondo)
    Participant.create(person: @drew, language: ewondo, start_date: '2018')
    @drew.reload
    assert_includes(
      @drew.notification_channels, 
      NotificationChannel.language_channel(ewondo.id)
    )
  end

  test 'Domains' do
    assert_equal [:Translation], @drew_hdi.domains
    @drew_hdi.add_role(:Translator) # Omit duplicates
    @drew_hdi.add_role(:DuluAdmin) # Omilt nil
    assert_equal [:Translation], @drew_hdi.domains
  end

  def some_valid_params(merge_params = {})
    rick = people(:Rick)
    { person: rick, language: @hdi_language,
      start_date: '2017' }.merge merge_params
  end
end
