class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include SessionsHelper
  include ApplicationHelper
	include RedirectToReferrer

  before_action :require_login, :set_locale, :store_redirect

  private

  def require_login
    return if logged_in?

    if request.path == root_path
      @failed_login_email = session[:failed_login]
      session.delete :failed_login
      render 'shared/welcome'
    else
      session[:original_request] = request.path
      redirect_to '/auth/google_oauth2'
    end
  end

  def set_locale
    I18n.locale = current_user.try(:ui_language) || I18n.default_locale
  end

  rescue_from "AccessGranted::AccessDenied" do |exception|
    redirect_to not_allowed_path
  end
end
