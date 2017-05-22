class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include SessionsHelper

  before_action :require_login, :set_locale

  private
    def require_login
      unless logged_in?
        session[:original_request] = request.path
        redirect_to login_url
      end
    end

    def set_locale
      I18n.locale = current_user.try(:ui_language) || I18n.default_locale
    end
end
