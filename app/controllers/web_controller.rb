class WebController < ApplicationController
  def index
    @user_data_json = make_user_data
  end

  private

  def make_user_data
    data = {
      id: current_user.id,
      first_name: current_user.first_name,
      last_name: current_user.last_name,
      ui_language: current_user.ui_language,
      view_prefs: current_user.view_prefs,
    }
    return JSON.generate(data).html_safe
  end
end
