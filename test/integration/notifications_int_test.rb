require 'test_helper'

class NotificationsIntTest < Capybara::Rails::TestCase

  def setup
    Capybara.current_driver = :webkit
  end

  def assert_notification(text, global=false)
    # click_on 'show-notifications-btn'
    within '#notificationsSidebar' do
      find('li', text: 'All').click if global
      assert_text text
    end
  end

  # test 'New participant program AND added you to program' do
  #   hdi = programs :Hdi
  #   lance = people :Lance

  #   log_in people(:Rick)
  #   visit new_program_participant_path(hdi)
  #   select 'Freeland, Lance', from: 'participant_person_id'
  #   fill_in 'participant_start_date_y', with: '2018'
  #   click_on 'Save'
  #   # log_out

  #   log_in lance
  #   assert_notification 'Rick Conrad added you to the Hdi program.'
  #   # log_out

  #   log_in people(:Drew)
  #   assert_notification 'Rick Conrad added Lance Freeland to the Hdi program.'
  # end

  # test 'New participant cluster AND Added you to cluster' do
  #   lance = people :Lance

  #   log_in people(:Rick)
  #   visit new_cluster_participant_path(clusters(:Ndop))
  #   select 'Freeland, Lance', from: 'participant_person_id'
  #   fill_in 'participant_start_date_y', with: '2018'
  #   click_on 'Save'
  #   # log_out

  #   log_in lance
  #   assert_notification 'Rick Conrad added you to the Ndop cluster.'
  #   # log_out

  #   log_in people(:Drew)
  #   assert_notification 'Rick Conrad added Lance Freeland to the Ndop cluster.'
  # end

  # test 'New Stage' do
  #   log_in people(:Rick)
  #   visit program_path(programs(:Hdi))
  #   within('tr', text: 'Genesis') { click_on 'Consultant Check in Progress' }
  #   fill_in 'stage_start_date_y', with: '2018'
  #   click_on 'Save'

  #   log_in people(:Drew)
  #   assert_notification 'Rick Conrad updated Genesis to the Consultant Checked stage for the Hdi program.'
  # end

  # test 'Workshop Complete' do
  #   log_in people(:Rick)
  #   visit activity_path(linguistic_activities(:EwondoGrammarIntro))
  #   within('tr', text: 'Verb') { click_on 'Mark Completed' }

  #   log_in people(:Kendall)
  #   assert_notification 'Rick Conrad updated the Verb workshop for the Ewondo program as complete.'
  # end

  # test 'New Activity' do
  #   log_in people(:Rick)
  #   visit new_program_activity_path(programs(:Hdi))
  #   select 'Linguistic', from: 'activity_type'
  #   fill_in 'activity_title', with: 'Words for Pizza'
  #   click_on 'Save'

  #   log_in people(:Drew)
  #   assert_notification 'Rick Conrad added a new activity to the Hdi program: Research: Words for Pizza.'
  # end

  # test 'Added a Testament' do
  #   log_in people(:Rick)
  #   visit new_program_activity_path(programs(:Ewondo))
  #   select 'Old Testament', from: 'activity_bible_book_id'
  #   click_on 'Save'

  #   log_in people(:Kendall)
  #   assert_notification 'Rick Conrad added a new activity to the Ewondo program: Old Testament.'
  # end

  # test 'Updated you' do
  #   log_in people(:Rick)
  #   visit person_path(people(:Drew))
  #   edit_editable_text('last_name', 'Maust', 'Clown')

  #   log_in people(:Drew)
  #   assert_notification 'Rick Conrad updated your info.'
  #   assert_notification 'Rick Conrad updated the info for Drew Clown.', true
  # end

  # test 'Updated himself' do
  #   log_in people(:Rick)
  #   visit person_path(people(:Rick))
  #   edit_editable_text('email', 'rick_conrad@sil.org', 'rick2000@aol.com')
  #   visit root_path
  #   assert_notification 'Rick Conrad updated his own info.', true
  # end

  # test 'Gave you role' do
  #   log_in people(:Rick)
  #   visit person_path(people(:Drew))
  #   within('#rolesTable') do 
  #     find('.addIconButton').click
  #     select 'Dulu Admin', from: 'basic_select'
  #     click_on 'Add'
  #   end

  #   log_in people(:Drew)
  #   assert_notification 'Rick Conrad gave you the Dulu Admin role.'
  #   assert_notification 'Rick Conrad gave the Dulu Admin role to Drew Maust.', true
  # end

  # test 'Gave himself role' do 
  #   log_in people(:Rick)
  #   visit person_path(people(:Rick))
  #   within('#rolesTable') do
  #     find('.addIconButton').click
  #     select 'Literacy Specialist', from: 'basic_select'
  #     click_on 'Add'
  #   end

  #   visit root_path
  #   assert_notification 'Rick Conrad gave himself the Literacy Specialist role.', true
  # end

  # test 'Added person to activity' do
  #   log_in people(:Rick)
  #   visit activity_path(translation_activities(:HdiGenesis))
  #   within('h3', text: 'People') { click_on 'Edit' }

  #   select 'Maust, Drew', from: 'participant_id'
  #   click_on 'Add'

  #   log_in people(:Drew)
  #   assert_notification 'Rick Conrad added you to Genesis for the Hdi program.'

  #   log_in people(:Andreas)
  #   assert_notification 'Rick Conrad added Drew Maust to Genesis for the Hdi program.'
  # end

  # test 'Added himself to activity' do
  #   log_in people(:Drew)
  #   visit activity_path(translation_activities(:HdiGenesis))
  #   within('h3', text: 'People') { click_on 'Edit' }
  #   select 'Maust, Drew', from: 'participant_id'
  #   click_on 'Add'

  #   log_in people(:Andreas)
  #   assert_notification 'Drew Maust added himself to Genesis for the Hdi program.'
  # end

  # test 'Added you to event' do
  #   log_in people(:Rick)
  #   visit event_path(events(:HdiGenesisChecking))
  #   within('h3', text: 'People') { click_on 'Edit' }
  #   select 'Isaac, Kendall', from: 'event_person_id'
  #   click_button 'Add'

  #   log_in people(:Kendall)
  #   assert_notification 'Rick Conrad added you to the Genesis Checking event.'

  #   log_in people(:Drew)
  #   assert_notification 'Rick Conrad added Kendall Isaac to the Genesis Checking event.'
  # end

  # test 'Added himself to event' do
  #   log_in people(:Rick)
  #   visit event_path(events(:HdiGenesisChecking))
  #   within('h3', text: 'People') { click_on 'Edit' }
  #   select 'Conrad, Rick', from: 'event_person_id'
  #   click_button 'Add'

  #   log_in people(:Drew)
  #   assert_notification 'Rick Conrad added himself to the Genesis Checking event.'
  # end

  # test 'New event for program' do
  #   log_in people(:Rick)
  #   visit new_program_event_path(programs(:Hdi))
  #   fill_in 'Name', with: 'Pizza Party'
  #   fill_in 'event_start_date_y', with: '2018'
  #   fill_in 'event_end_date_y', with: '2018'
  #   click_on 'Save'

  #   log_in people(:Drew)
  #   assert_notification 'Rick Conrad created the Pizza Party event for the Hdi program.'
  # end

  # test 'Add program to event' do
  #   log_in people(:Rick)
  #   visit event_path(events(:HdiGenesisChecking))
  #   within('h3', text: 'Programs') { click_on 'Edit' }
  #   select 'Ewondo', from: 'event_program'
  #   click_button 'Add'

  #   log_in people(:Kendall)
  #   assert_notification 'Rick Conrad added the Ewondo program to the Genesis Checking event.'
  # end

  # test 'Add cluster to event' do
  #   log_in people(:Rick)
  #   visit event_path(events(:HdiGenesisChecking))
  #   within('h3', text: 'Clusters') { click_on 'Add' }
  #   select 'Ndop', from: 'event_cluster'
  #   click_button 'Add'

  #   log_in people(:Drew)
  #   assert_notification 'Rick Conrad added the Ndop cluster to the Genesis Checking event.'
  # end
end
