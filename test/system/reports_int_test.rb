require 'application_system_test_case'

class ReportsIntTest < ApplicationSystemTestCase
  test 'Generate Report' do
    log_in people(:Rick)
    visit '/reports'
    within(parent(find('label', text: 'Clusters'))) { fill_in_search_input('Ndop') }
    assert_selector('h2', text: 'Language Comparison Report')
    assert_selector('h3' , text: 'Ndop')
    assert_selector('h4', text: 'Bambalang')
    within(parent(find('label', text: 'Languages'))) { fill_in_search_input('Ewondo') }
    assert_selector('h4', text: 'Ewondo')

    click_on 'Save'
    fill_in 'name', with: 'Ndop-Ewondo'
    click_on 'Save'
    assert_selector('h2', text: 'Ndop-Ewondo')
    assert_text 'Created by Rick Conrad'
  end
end