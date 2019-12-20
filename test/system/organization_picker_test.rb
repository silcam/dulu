# frozen_string_literal: true

require 'application_system_test_case'

class OrganizationPickerTest < ApplicationSystemTestCase
  def setup
    log_in people(:Olga)
    visit model_path(organizations(:SIL))
    action_bar_click_edit
  end

  test 'Create new organization in picker' do
    within('li', text: 'Parent Organization') do
      fill_in('query', with: 'wycliffe alliance', fill_options: { clear: :backspace })
      click_on 'Add Organization'
      click_on 'Save'
    end
    assert_no_text 'New Organization'
    click_on 'Save'
    assert_text('Parent Organization: Wycliffe Alliance')
  end
end
