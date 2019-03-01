require 'application_system_test_case'

class NotificationsIntTest < ApplicationSystemTestCase
  #include ApplicationHelper

  def assert_notification(text, global=false)
    # click_on 'show-notifications-btn'
    within parent(find('h3', text: 'Notifications')) do
      find('li', text: 'All').click if global
      assert_text text
    end
  end

  test 'New participant program AND added you to program' do
    hdi = languages :Hdi
    lance = people :Lance

    log_in people(:Rick)
    visit "#{model_path(hdi)}/People"
    within(parent(find('h3', text: 'People'))) do
      click_icon('addIcon')
      fill_in_search_input('Lance Freeland')
      fill_in_date(FuzzyDate.new(2018))
      click_on 'Save'
    end

    log_in lance
    visit "/"
    assert_notification 'Rick Conrad added you to the Hdi program.'
    # log_out

    log_in people(:Drew)
    visit "/"
    assert_notification 'Rick Conrad added Lance Freeland to the Hdi program.'
  end

  test 'New participant cluster AND Added you to cluster' do
    lance = people :Lance

    log_in people(:Rick)
    visit model_path(clusters(:Ndop))
    within(parent(find('h3', text: 'People'))) do
      click_icon('addIcon')
      fill_in_search_input('Lance Freeland')
      fill_in_date(FuzzyDate.new(2018))
      click_on 'Save'
    end

    log_in lance
    visit "/"
    assert_notification 'Rick Conrad added you to the Ndop cluster.'

    log_in people(:Drew)
    visit "/"
    assert_notification 'Rick Conrad added Lance Freeland to the Ndop cluster.'
  end

  test 'New Stage' do
    log_in people(:Rick)
    visit "#{model_path(languages(:Hdi))}/Translation"

    find('tr', text: 'Genesis Consultant Check').find('button', text: 'Consultant Check in Progress').click
    within('tr', text: 'Update Stage:') do
      # find('select').select('Consultant Checked')
      click_on('Update')
    end
    find('tr', text: 'As of').click_on('Save')

    log_in people(:Drew)
    visit "/"
    assert_notification 'Rick Conrad updated Genesis to the Consultant Checked stage for the Hdi program.'
  end

  test 'Workshop Complete' do
    log_in people(:Rick)
    visit model_path(languages(:Ewondo)) + "/Linguistics" # activity_path(linguistic_activities(:EwondoGrammarIntro))
    click_on "Grammar Intro"
    find('tr', text: 'Verb').click_on("Completed")

    log_in people(:Kendall)
    visit "/"
    assert_notification 'Rick Conrad updated the Verb workshop for the Ewondo program as complete.'
  end

  test 'New Activity' do
    log_in people(:Rick)
    visit model_path(languages(:Hdi)) + "/Linguistics" # new_program_activity_path(programs(:Hdi))
    within(parent(find('h3', text: 'Research Activities'))) do
      click_icon('addIcon')
      fill_in "New Activity", with: 'Words for Pizza'
      click_on 'Save'
    end

    log_in people(:Drew)
    visit "/"
    assert_notification 'Rick Conrad added a new activity to the Hdi program: Research: Words for Pizza'
  end

  test 'Updated you' do
    log_in people(:Rick)
    visit model_path(people(:Drew))
    action_bar_click_edit
    fill_in 'first_name', with: 'Mista'
    click_on 'Save'

    log_in people(:Drew)
    visit "/"
    assert_notification 'Rick Conrad updated your info'
    assert_notification 'Rick Conrad updated the info for Mista Maust', true
  end

  test 'Updated himself' do
    log_in people(:Rick)
    visit model_path(people(:Rick))
    action_bar_click_edit
    fill_in 'first_name', with: 'Richard'
    click_on 'Save'
    # edit_editable_text('email', 'rick_conrad@sil.org', 'rick2000@aol.com')
    visit root_path
    visit "/"
    assert_notification 'Rick Conrad updated his own info', true
  end

  test 'Gave you role' do
    log_in people(:Rick)
    visit model_path(people(:Drew))

    within(parent(find('h3', text: 'Roles'))) do
      find(icon_selector('addIcon')).click
      find('select').select 'Dulu Admin'
      click_on 'Save'
    end

    log_in people(:Drew)
    visit "/"
    assert_notification 'Rick Conrad gave you the Dulu Admin role'
    assert_notification 'Rick Conrad gave the Dulu Admin role to Drew Maust', true
  end

  test 'Gave himself role' do 
    log_in people(:Rick)
    visit model_path(people(:Rick))
    within(parent(find('h3', text: 'Roles'))) do
      find(icon_selector('addIcon')).click
      find('select').select 'Literacy Specialist'
      click_on 'Save'
    end

    visit root_path
    assert_notification 'Rick Conrad gave himself the Literacy Specialist role', true
  end

  test 'Added person to activity' do
    postpone_failure(Date.new(2019, 2, 28))
    # log_in people(:Rick)
    # visit activity_path(translation_activities(:HdiGenesis))
    # within('h3', text: 'People') { click_on 'Edit' }

    # select 'Maust, Drew', from: 'participant_id'
    # click_on 'Add'

    # log_in people(:Drew)
    # assert_notification 'Rick Conrad added you to Genesis for the Hdi program'

    # log_in people(:Andreas)
    # assert_notification 'Rick Conrad added Drew Maust to Genesis for the Hdi program'
  end

  test 'Added himself to activity' do
    postpone_failure(Date.new(2019, 2, 28))
    # log_in people(:Drew)
    # visit activity_path(translation_activities(:HdiGenesis))
    # within('h3', text: 'People') { click_on 'Edit' }
    # select 'Maust, Drew', from: 'participant_id'
    # click_on 'Add'

    # log_in people(:Andreas)
    # assert_notification 'Drew Maust added himself to Genesis for the Hdi program'
  end

  test 'Added you to event' do
    postpone_failure(Date.new(2019, 3, 28))
    # log_in people(:Rick)
    # visit event_path(events(:HdiGenesisChecking))
    # within('h3', text: 'People') { click_on 'Edit' }
    # select 'Isaac, Kendall', from: 'event_person_id'
    # click_button 'Add'

    # log_in people(:Kendall)
    # assert_notification 'Rick Conrad added you to the Genesis Checking event.'

    # log_in people(:Drew)
    # assert_notification 'Rick Conrad added Kendall Isaac to the Genesis Checking event.'
  end

  test 'Added himself to event' do
    postpone_failure(Date.new(2019, 3, 28))
    # log_in people(:Rick)
    # visit event_path(events(:HdiGenesisChecking))
    # within('h3', text: 'People') { click_on 'Edit' }
    # select 'Conrad, Rick', from: 'event_person_id'
    # click_button 'Add'

    # log_in people(:Drew)
    # assert_notification 'Rick Conrad added himself to the Genesis Checking event.'
  end

  test 'New event for program' do
    postpone_failure(Date.new(2019, 3, 28))
    # log_in people(:Rick)
    # visit new_program_event_path(programs(:Hdi))
    # fill_in 'Name', with: 'Pizza Party'
    # fill_in 'event_start_date_y', with: '2018'
    # fill_in 'event_end_date_y', with: '2018'
    # click_on 'Save'

    # log_in people(:Drew)
    # assert_notification 'Rick Conrad created the Pizza Party event for the Hdi program.'
  end

  test 'Add program to event' do
    postpone_failure(Date.new(2019, 3, 28))
    # log_in people(:Rick)
    # visit event_path(events(:HdiGenesisChecking))
    # within('h3', text: 'Programs') { click_on 'Edit' }
    # select 'Ewondo', from: 'event_program'
    # click_button 'Add'

    # log_in people(:Kendall)
    # assert_notification 'Rick Conrad added the Ewondo program to the Genesis Checking event.'
  end

  test 'Add cluster to event' do
    postpone_failure(Date.new(2019, 3, 28))
    # log_in people(:Rick)
    # visit event_path(events(:HdiGenesisChecking))
    # within('h3', text: 'Clusters') { click_on 'Add' }
    # select 'Ndop', from: 'event_cluster'
    # click_button 'Add'

    # log_in people(:Drew)
    # assert_notification 'Rick Conrad added the Ndop cluster to the Genesis Checking event.'
  end
end
