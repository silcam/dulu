require 'test_helper'

class NotificationTest < ActiveSupport::TestCase

  def setup
    @drew = people :Drew
    @rick = people :Rick
    @lance = people :Lance
    @andreas = people :Andreas
    @hdi = programs :Hdi
    # @old_count = Notification.count #It will be 0
  end

  test 't_vars' do
    I18n.locale = :en
    n = Notification.new(vars: {user_name: 'Rick Conrad', activity_name: {en: 'Genesis', fr: 'Genèse'}})
    exp = {user_name: 'Rick Conrad', activity_name: 'Genesis'}
    assert_equal exp, n.t_vars
  end

  test 'New participant program' do
    lance_hdi = Participant.create(person: @lance, program: @hdi, start_date: '2018')
    Notification.new_program_participant(@drew, lance_hdi)
    assert_equal 3, Notification.where(kind: :new_program_participant).count
    assert_equal 1, Notification.where(kind: :added_you_to_program).count
    assert_equal 1, people(:Abanda).notifications.count
    assert_equal 1, @andreas.notifications.count # LPF
  end

  test 'New participant cluster' do
    ndop = clusters :Ndop
    kendall_ndop = Participant.create(person: people(:Kendall), cluster: ndop, start_date: '2018')
    Notification.new_cluster_participant @rick, kendall_ndop
    assert_equal 3, Notification.where(kind: :new_cluster_participant).count
    assert_equal 1, Notification.where(kind: :added_you_to_cluster).count
    assert_equal 1, @drew.notifications.count
    assert_equal 1, people(:Olga).notifications.count # LPF
  end

  test 'New stage' do
    ezra_testing = Stage.create!(activity: translation_activities(:HdiEzra), start_date: '2018', name: :Testing, kind: :Translation)
    Notification.new_stage(@drew, ezra_testing)
    assert_equal 3, Notification.count
    assert_equal 1, people(:Abanda).notifications.count
    assert_equal 1, @andreas.notifications.count # LPF
  end

  test 'Workshop complete' do
    verbshop = workshops :Verb
    verbshop.complete({})
    Notification.workshop_complete(@rick, verbshop)
    assert_equal 3, Notification.count
    assert_equal 1, people(:Kendall).notifications.count
    assert_equal 1, people(:Olga).notifications.count # LPF
  end

  test 'New activity' do
    dvu_study = LinguisticActivity.create(category: :Research, title: 'Dvu', program: @hdi)
    # alternate version :
    # dvu_study = TranslationActivity.create(program: @hdi, bible_book: bible_books(:John))
    Notification.new_activity(@drew, dvu_study)
    assert_equal 3, Notification.count
    assert_equal 1, people(:Abanda).notifications.count
    assert_equal 1, @andreas.notifications.count # LPF
  end

  test 'Added a testament' do
    Notification.added_a_testament(@rick, :Old_testament, programs(:Ewondo))
    assert_equal 3, Notification.count
    assert_equal 1, people(:Kendall).notifications.count
    assert_equal 1, people(:Olga).notifications.count # LPF
  end

  test 'Updated you' do
    Notification.updated_you(@rick, @drew)
    assert_equal 1, Notification.where(kind: :updated_you).count
    assert_equal 1, Notification.where(kind: :updated_person).count
    assert_equal 'updated_you', @drew.notifications.first.kind
  end

  test 'Updated himself' do
    Notification.updated_you(@rick, @rick)
    assert_equal 1, Notification.count
    assert_equal 'updated_himself', Notification.first.kind
  end

  test 'Gave you role' do
    Notification.gave_you_role(@rick, @drew, :Literacy_specialist)
    assert_equal 1, Notification.where(kind: :gave_you_role).count
    assert_equal 1, Notification.where(kind: :gave_person_role).count
    notification = @drew.notifications.first
    assert_equal 'gave_you_role', notification.kind
    assert_equal 'Literacy Specialist', notification.t_vars[:role_name]
  end

  test 'Gave himself role' do
    Notification.gave_you_role(@rick, @rick, :Literacy_specialist)
    assert_equal 1, Notification.count
    assert_equal 'gave_himself_role', Notification.first.kind
  end

  # test 'Added you to program' do
  #   lance_hdi = Participant.create(person: @lance, program: @hdi, start_date: '2018')
  #   Notification.added_you_to_program(@drew, lance_hdi)
  #   assert_equal 1, Notification.count
  #   assert_equal 1, @lance.notifications.count
  # end

  # test 'Added person to cluster' do
  #   Notification.added_person_to_cluster(@rick, participants(:DrewNdop))
  #   assert_equal 1, Notification.count
  #   assert_equal 1, @drew.notifications.count
  # end

  test 'Added person to activity' do
    Notification.added_person_to_activity(@rick, @drew, translation_activities(:HdiGenesis))
    assert_equal 3, Notification.where(kind: :added_person_to_activity).count
    assert_equal 1, Notification.where(kind: :added_you_to_activity).count
    # assert_equal 1, Notification.count
    # assert_equal 1, @drew.notifications.count
  end

  test 'Added himself to activity' do
    Notification.added_person_to_activity(@drew, @drew, translation_activities(:HdiGenesis))
    assert_equal 3, Notification.count
    assert_equal 3, Notification.where(kind: :added_himself_to_activity).count
  end

  test 'Added you to event' do
    Notification.added_person_to_event(@rick, event_participants(:DrewHdiGenesis))
    assert_equal 2, Notification.where(kind: :added_person_to_event).count
    assert_equal 1, Notification.where(kind: :added_you_to_event).count
    assert_equal 1, @drew.notifications.count
  end

  test 'Added himself to event' do
    Notification.added_person_to_event(@drew, event_participants(:DrewHdiGenesis))
    assert_equal 2, Notification.count
    assert_equal 2, Notification.where(kind: :added_himself_to_event).count
  end

  test 'New event for program' do
    Notification.new_event_for_program(@drew, events(:HdiGenesisChecking), @hdi)
    assert_equal 3, Notification.count
    assert_equal 1, people(:Abanda).notifications.count
    assert_equal 1, @andreas.notifications.count # LPF
  end

  test 'Added program to event' do
    Notification.added_program_to_event(@drew, @hdi, events(:HdiGenesisChecking))
    assert_equal 3, Notification.count
    assert_equal 1, people(:Abanda).notifications.count
    assert_equal 1, @andreas.notifications.count # LPF
  end

  test 'Added cluster to event' do
    Notification.added_cluster_to_event(@rick, clusters(:Ndop), events(:HdiGenesisChecking))
    assert_equal 4, Notification.count
    assert_equal 1, @drew.notifications.count
    assert_equal 1, people(:Olga).notifications.count # LPF
  end
end
