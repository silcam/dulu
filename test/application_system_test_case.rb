require "test_helper"

Capybara.register_driver(:headless_chrome) do |app|
  capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(
    chromeOptions: { args: %w[headless disable-gpu window-size=1600x1080] },
  )

  Capybara::Selenium::Driver.new(
    app,
    browser: :chrome,
    desired_capabilities: capabilities,
  )
end

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  include ApplicationHelper
  
  driven_by :headless_chrome
  # driven_by :selenium, using: :chrome, screen_size: [1400, 1400]

  def teardown
    errors = page.driver.browser.manage.logs.get(:browser)
    if errors.present?
      errors.each do |error|
        puts "\e[31m#{error}\e[0m"
      end
    end
  end

  def page_has_link?(path)
    page.has_css? "a[href='#{path}']"
  end

  def click_link_to(path)
    find(:css, "a[href='#{path}']").click
  end

  def fill_in_date(date)
    fill_in "year", with: date.year
    sel_month = date.month.nil? ? I18n.t(:Month) : I18n.t('date.abbr_month_names')[date.month]
    sel_day = date.day.nil? ? I18n.t(:Day) : date.day
    select sel_month, from: "month"
    select sel_day, from: "day"
  end

  # def error_message_with(content)
  #   find(:css, 'div#error-explanation').has_content? content
  # end

  # def accept_js_confirm
  #   page.driver.browser.accept_js_confirms
  # end

  # def click_editable_text(text)
  #   if text
  #     find('.editableText', text: text).click
  #   else
  #     find('.addIconButton').click
  #   end
  # end

  # def edit_editable_text(field, text, new_text)
  #   click_editable_text(text)
  #   within('.editableTextInput') do
  #     fill_in(field, with: new_text)
  #     find('input[type="text"]').send_keys(:enter)
  #     # fill_in(currently_with: text, with: new_text)
  #   end
  # end

  # def edit_editable_search_text(text, new_text)
  #   click_editable_text(text)
  #   edit_search_input(new_text)
  # end

  def fill_in_search_input(text)
    fill_in('query', with: text)
    find('li', text: text).click
  end

  # def edit_editable_text_area(field, text, new_text)
  #   click_editable_text(text)
  #   within('.editableTextInput') do
  #     fill_in(field, with: new_text)
  #     click_button 'Save'
  #   end
  # end

  def assert_changes_saved
    assert find('p', text: 'All changes saved.')
  end

  def parent(node)
    return node.find(:xpath, '..')
  end

  def find_by_placeholder(placeholder)
    return find("input[placeholder='#{placeholder}']")
  end

  def icon_selector(icon_name)
    return "span[data-icon-name='#{icon_name}']"
  end

  def action_bar_edit_click
    find('div[data-div-name=editActionBar]').find(icon_selector('editIcon')).click
  end

  def action_bar_delete_click
    find('div[data-div-name=editActionBar]').find(icon_selector('deleteIcon')).click
  end
end
