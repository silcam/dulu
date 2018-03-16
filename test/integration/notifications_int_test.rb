require 'test_helper'

class NotificationsIntTest < Capybara::Rails::TestCase

  def setup
    Capybara.current_driver = :webkit
  end

  def assert_notification(text)
    click_on 'show-notifications-btn'
    within 'ul.notifications' do
      assert_text text
    end
  end

  test "New participant program AND added you to program" do
    hdi = programs :Hdi
    lance = people :Lance

    log_in people(:Rick)
    visit new_program_participant_path(hdi)
    select "Freeland, Lance", from: 'participant_person_id'
    fill_in 'participant_start_date_y', with: "2018"
    click_on "Save"
    # log_out

    log_in lance
    assert_notification "Rick Conrad added you to the Hdi program."
    # log_out

    log_in people(:Drew)
    assert_notification "Rick Conrad added Lance Freeland to the Hdi program."
  end

  test "New participant cluster AND Added you to cluster" do
    lance = people :Lance

    log_in people(:Rick)
    visit new_cluster_participant_path(clusters(:Ndop))
    select "Freeland, Lance", from: 'participant_person_id'
    fill_in 'participant_start_date_y', with: "2018"
    click_on "Save"
    # log_out

    log_in lance
    assert_notification "Rick Conrad added you to the Ndop cluster."
    # log_out

    log_in people(:Drew)
    assert_notification "Rick Conrad added Lance Freeland to the Ndop cluster."
  end


  test "New Stage" do
    log_in people(:Rick)
    visit program_path(programs(:Hdi))
    within('tr', text: "Genesis") { click_on "Consultant Check in Progress" }
    fill_in 'stage_start_date_y', with: "2018"
    click_on "Save"

    log_in people(:Drew)
    assert_notification "Rick Conrad updated Genesis to the Consultant Checked stage for the Hdi program."
  end











  # test "New stage" do
  #   ezra_testing = Stage.create!(activity: translation_activities(:HdiEzra), start_date: '2018', name: :Testing, kind: :Translation)
  #   Notification.generate(:new_stage, @drew, ezra_testing)
  #   assert_equal 2, Notification.count
  #   assert_equal 1, people(:Abanda).notifications.count
  #   assert_equal 1, @andreas.notifications.count # LPF
  # end
#   #
#   # test "Workshop complete" do
#   #   verbshop = workshops :Verb
#   #   verbshop.complete({})
#   #   Notification.generate(:workshop_complete, @rick, verbshop)
#   #   assert_equal 2, Notification.count
#   #   assert_equal 1, people(:Kendall).notifications.count
#   #   assert_equal 1, people(:Olga).notifications.count # LPF
#   # end
#   #
#   # test "New activity" do
#   #   dvu_study = LinguisticActivity.create(category: :Research, title: 'Dvu', program: @hdi)
#   #   #dvu_study = TranslationActivity.create(program: @hdi, bible_book: bible_books(:John))
#   #   Notification.generate(:new_activity, @drew, dvu_study)
#   #   assert_equal 2, Notification.count
#   #   assert_equal 1, people(:Abanda).notifications.count
#   #   assert_equal 1, @andreas.notifications.count # LPF
#   # end
#   #
#   # test "Added a testament" do
#   #   Notification.generate(:added_a_testament, @rick, programs(:Ewondo), testament: 'ot')
#   #   assert_equal 2, Notification.count
#   #   assert_equal 1, people(:Kendall).notifications.count
#   #   assert_equal 1, people(:Olga).notifications.count # LPF
#   # end
#   #
#   # test "Updated you" do
#   #   Notification.generate(:updated_you, @rick, @drew)
#   #   assert_equal 1, Notification.count
#   #   assert_equal 'updated_you', @drew.notifications.first.kind
#   # end
#   #
#   # test "Gave you role" do
#   #   Notification.generate(:gave_you_role, @rick, @drew, role: :Literacy_specialist)
#   #   assert_equal 1, Notification.count
#   #   notification = @drew.notifications.first
#   #   assert_equal 'gave_you_role', notification.kind
#   #   assert_equal 'Literacy_specialist', notification.details[:role]
#   # end
#   #
#   # test "Added you to cluster" do
#   #   Notification.generate(:added_you_to_cluster_program, @rick, participants(:DrewNdop))
#   #   assert_equal 1, Notification.count
#   #   assert_equal 1, @drew.notifications.count
#   # end
#   #
#   # test "Added you to activity" do
#   #   Notification.generate(:added_you_to_activity, @rick, participants(:DrewHdi), activity_id: translation_activities(:HdiGenesis).id)
#   #   assert_equal 1, Notification.count
#   #   assert_equal 1, @drew.notifications.count
#   # end
#   #
#   # test "Added you to event" do
#   #   Notification.generate(:added_you_to_event, @rick, event_participants(:DrewHdiGenesis))
#   #   assert_equal 1, Notification.count
#   #   assert_equal 1, @drew.notifications.count
#   # end
#   #
#   # test "New event for program" do
#   #   Notification.generate(:new_event_for_program, @drew, events(:HdiGenesisChecking), program_id: @hdi.id)
#   #   assert_equal 2, Notification.count
#   #   assert_equal 1, people(:Abanda).notifications.count
#   #   assert_equal 1, @andreas.notifications.count # LPF
#   # end
#   #
#   # test "Added cluster to event" do
#   #   Notification.generate(:added_cluster_to_event, @rick, events(:HdiGenesisChecking), cluster_id: clusters(:Ndop).id)
#   #   assert_equal 2, Notification.count
#   #   assert_equal 1, @drew.notifications.count
#   #   assert_equal 1, people(:Olga).notifications.count # LPF
#   # end
end
