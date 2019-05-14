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
        unless error.to_s.include?("Can't perform a React state update on an unmounted component.")
          puts "\e[31m#{self.method_name} : #{error}\e[0m"
        end
      end
    end
    # sleep(0.4) # Avoids many spurious errors
    puts "Finished #{self.method_name}\u001b[0K"
  end
  
  def simulate_oauth(user)
    OmniAuth.config.test_mode = true
    OmniAuth.config.add_mock(:google_oauth2, {info: {email: user.email}})
  end

  def log_in(user, fails=0)
    Capybara.current_session.driver.browser.manage.delete_all_cookies
    simulate_oauth user
    visit '/events/new' # A page that doesn't turn around and load a bunch of junk
    unless page.has_text?(user.first_name)
      assert fails < 6
      puts 'LOG IN FAILURE - TRYING AGAIN'
      log_in(user, fails + 1)
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
    fill_in('query', with: text, fill_options: { clear: :backspace })
    find('li', text: text).click
  end

  def clear_search_input
    fill_in('query', with: '', fill_options: { clear: :backspace })
    find('input[name=query]').native.send_keys(:return)
  end

  # def edit_editable_text_area(field, text, new_text)
  #   click_editable_text(text)
  #   within('.editableTextInput') do
  #     fill_in(field, with: new_text)
  #     click_button 'Save'
  #   end
  # end

  def assert_changes_saved
    assert_text 'All changes saved.'
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

  def click_icon(icon_name)
    find(icon_selector(icon_name)).click
  end

  def action_bar_click_edit
    find('div[data-div-name=editActionBar]').find(icon_selector('editIcon')).click
  end

  def action_bar_click_delete
    find('div[data-div-name=editActionBar]').find(icon_selector('deleteIcon')).click
  end

  def safe_assert_no_selector(*args)
    sleep(0.2)
    assert_no_selector(*args)
  end

  def safe_assert_no_text(*args)
    sleep(0.2)
    assert_no_text(*args)
  end
end
