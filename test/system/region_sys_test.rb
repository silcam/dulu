require 'application_system_test_case'

class RegionSysTest < ApplicationSystemTestCase
  test "Create Region" do
    log_in people(:Olga)
    visit '/regions'
    find(icon_selector('addIcon')).click
    fill_in "name", with: "Up Yonder"
    click_on "Save"
    assert_selector("h2", text: "Up Yonder")
    assert_selector("td", text: "Up Yonder")
  end

  test "Delete Region" do
    log_in people(:Rick)
    visit '/regions'
    find("tr", text: 'North Region').click
    page.accept_confirm do
      action_bar_click_delete
    end
    assert_current_path '/regions'
    assert_no_selector('tr', text: 'North Region')
  end

  test "Update Name" do
    go_to_page
    action_bar_click_edit
    fill_in "name", with: "El Norte!"
    click_on "Save"
    assert_selector('h2', text: 'El Norte!')
    assert_selector('tr', text: 'El Norte!')
  end

  test "Add Language" do
    go_to_page
    assert_no_selector('a', text: 'Ewondo')
    action_bar_click_edit
    within parent(find('label', text: "Languages")) do
      fill_in_search_input('Ewond')
    end
    click_on 'Save'
    assert_selector('a', text: 'Ewondo')
  end

  test "Add and Remove Cluster" do
    go_to_page
    assert_no_selector('a', text: 'Ndop')
    action_bar_click_edit
    within parent(find('label', text: "Clusters")) do
      fill_in_search_input('Ndo')
    end
    click_on 'Save'
    assert_selector('a', text: 'Ndop')

    # Remove Cluster
    action_bar_click_edit
    within('tr', text: 'Ndop'){ click_icon('deleteIcon') }
    click_on 'Save'
    assert_no_selector('a', text: 'Ndop')
  end

  test "Remove Language" do
    go_to_page
    assert_selector('a', text: 'Hdi')
    action_bar_click_edit
    within('tr', text: 'Hdi'){ click_icon('deleteIcon') }
    click_on 'Save'
    assert_no_selector('a', text: 'Hdi')
  end

  test "Change LPF" do
    go_to_page
    assert_text("LPF: Andreas Ernst")
    action_bar_click_edit
    within('label', text: 'LPF') do
      fill_in_search_input('Drew Maust')
    end
    click_on 'Save'
    assert_text("LPF: Drew Maust")
  end

  test "Remove LPF" do
    go_to_page
    assert_text("LPF: Andreas Ernst")
    action_bar_click_edit
    within('label', text: 'LPF') do
      clear_search_input
    end
    click_on 'Save'
    assert_no_text("LPF:")
  end

  test "Olga can't Delete Region" do
    go_to_page
    sleep(0.2) # Give time for action bar to appear
    assert_no_selector(icon_selector('deleteIcon'))
  end

  test "Drew can't Edit Region" do
    log_in people(:Drew)
    visit '/regions'
    find("tr", text: 'North Region').click
    sleep(0.2) # Give time for action bar to appear
    assert_no_selector(icon_selector('editIcon'))
  end

  def go_to_page
    log_in people(:Olga)
    visit '/regions'
    find("tr", text: 'North Region').click
  end
end