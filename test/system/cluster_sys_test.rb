require 'application_system_test_case'

class ClusterSysTest < ApplicationSystemTestCase
  test "Create Cluster" do
    log_in people(:Olga)
    visit '/clusters'
    find(icon_selector('addIcon')).click
    fill_in "name", with: "Kluster"
    click_on "Save"
    assert_selector("h2", text: "Kluster")
    assert_selector("td", text: "Kluster")
    sleep(0.2) # Don't let DB rollback delete cluster before ajax is done
  end

  test "Delete Cluster" do
    log_in people(:Rick)
    visit '/clusters'
    find("tr", text: 'Ndop').click
    sleep(0.2) # Let ajax finish before deleting
    page.accept_confirm do
      action_bar_click_delete
    end
    assert_current_path '/clusters'
    safe_assert_no_selector('tr', text: 'Ndop')
  end

  test "Update Cluster Name" do
    go_to_page
    action_bar_click_edit
    fill_in "name", with: "Misaje"
    click_on "Save"
    assert_selector('h2', text: 'Misaje')
    assert_selector('tr', text: 'Misaje')
  end

  test "Add Language to Cluster" do
    go_to_page
    safe_assert_no_selector('a', text: 'Ewondo')
    action_bar_click_edit
    fill_in_search_input('Ewond')
    click_on 'Save'
    assert_selector('a', text: 'Ewondo')
  end

  test "Remove Language from Cluster" do
    go_to_page
    assert_selector('a', text: 'Bangolan')
    action_bar_click_edit
    within('tr', text: 'Bangolan'){ click_icon('deleteIcon') }
    click_on 'Save'
    safe_assert_no_selector('a', text: 'Bangolan')
  end

  test "Add Cluster Participant" do
    go_to_page
    within(parent(find('h3', text: 'People'))) do
       click_icon('addIcon')
       fill_in_search_input('Lance Fre')
       fill_in_date(FuzzyDate.new(2016, 7, 31))
       click_on 'Save'
    end
    assert_selector('h2', text: 'Lance Freeland')
    assert_text 'Translation Consultant'
    assert_text 'Joined Program 2016-07-31'
  end


  test "Olga can't Delete Cluster" do
    go_to_page
    sleep(0.2) # Give time for action bar to appear
    safe_assert_no_selector(icon_selector('deleteIcon'))
  end

  test "Drew can't Edit Cluster" do
    log_in people(:Drew)
    visit '/clusters'
    find("tr", text: 'Ndop').click
    sleep(0.2) # Give time for action bar to appear
    safe_assert_no_selector(icon_selector('editIcon'))
  end

  def go_to_page
    log_in people(:Olga)
    visit '/clusters'
    find("tr", text: 'Ndop').click
  end
end