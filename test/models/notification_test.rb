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

  test "New participant program" do
    lance_hdi = Participant.create(person: @lance, program: @hdi, start_date: '2018')
    Notification.generate(:new_participant, @drew, lance_hdi)
    assert_equal 2, Notification.count
    assert_equal 1, people(:Abanda).notifications.count
    assert_equal 1, @andreas.notifications.count # LPF
  end

  test "New participant cluster" do
    ndop = clusters :Ndop
    kendall_ndop = Participant.create(person: people(:Kendall), cluster: ndop, start_date: '2018')
    Notification.generate(:new_participant, @rick, kendall_ndop)
    assert_equal 2, Notification.count
    assert_equal 1, @drew.notifications.count
    assert_equal 1, people(:Olga).notifications.count # LPF
  end

  test "New stage" do
    ezra_testing = Stage.create!(activity: translation_activities(:HdiEzra), start_date: '2018', name: :Testing, kind: :Translation)
    Notification.generate(:new_stage, @drew, ezra_testing)
    assert_equal 2, Notification.count
    assert_equal 1, people(:Abanda).notifications.count
    assert_equal 1, @andreas.notifications.count # LPF
  end

  test "Workshop complete" do
    verbshop = workshops :Verb
    verbshop.complete({})
    Notification.generate(:workshop_complete, @rick, verbshop)
    assert_equal 2, Notification.count
    assert_equal 1, people(:Kendall).notifications.count
    assert_equal 1, people(:Olga).notifications.count # LPF
  end

  test "New activity" do
    dvu_study = LinguisticActivity.create(category: :Research, title: 'Dvu', program: @hdi)
    #dvu_study = TranslationActivity.create(program: @hdi, bible_book: bible_books(:John))
    Notification.generate(:new_activity, @drew, dvu_study)
    assert_equal 2, Notification.count
    assert_equal 1, people(:Abanda).notifications.count
    assert_equal 1, @andreas.notifications.count # LPF
  end

  test "Added a testament" do
    Notification.generate(:added_a_testament, @rick, programs(:Ewondo), testament: 'ot')
    assert_equal 2, Notification.count
    assert_equal 1, people(:Kendall).notifications.count
    assert_equal 1, people(:Olga).notifications.count # LPF
  end

  test "Updated you" do
    Notification.generate(:updated_you, @rick, @drew)
    assert_equal 1, Notification.count
    assert_equal 'updated_you', @drew.notifications.first.kind
  end

  test "Gave you role" do
    Notification.generate(:gave_you_role, @rick, @drew, role: :Literacy_specialist)
    assert_equal 1, Notification.count
    notification = @drew.notifications.first
    assert_equal 'gave_you_role', notification.kind
    assert_equal 'Literacy_specialist', notification.details[:role]
  end

  test "Added you to program" do
    lance_hdi = Participant.create(person: @lance, program: @hdi, start_date: '2018')
    Notification.generate(:added_you_to_cluster_program, @drew, lance_hdi)
    assert_equal 1, Notification.count
    assert_equal 1, @lance.notifications.count
  end

  test "Added you to cluster" do
    Notification.generate(:added_you_to_cluster_program, @rick, participants(:DrewNdop))
    assert_equal 1, Notification.count
    assert_equal 1, @drew.notifications.count
  end

  test "Added you to activity" do
    Notification.generate(:added_you_to_activity, @rick, participants(:DrewHdi), activity_id: translation_activities(:HdiGenesis).id)
    assert_equal 1, Notification.count
    assert_equal 1, @drew.notifications.count
  end

  test "Added you to event" do
    Notification.generate(:added_you_to_event, @rick, event_participants(:DrewHdiGenesis))
    assert_equal 1, Notification.count
    assert_equal 1, @drew.notifications.count
  end

  test "New event for program" do
    Notification.generate(:new_event_for_program, @drew, events(:HdiGenesisChecking), program_id: @hdi.id)
    assert_equal 2, Notification.count
    assert_equal 1, people(:Abanda).notifications.count
    assert_equal 1, @andreas.notifications.count # LPF
  end

  test "Added cluster to event" do
    Notification.generate(:added_cluster_to_event, @rick, events(:HdiGenesisChecking), cluster_id: clusters(:Ndop).id)
    assert_equal 3, Notification.count
    assert_equal 1, @drew.notifications.count
    assert_equal 1, people(:Olga).notifications.count # LPF
  end
end
