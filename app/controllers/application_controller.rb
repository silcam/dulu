class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include SessionsHelper
  include ApplicationHelper
  # include RedirectToReferrer

  before_action :require_login, :log_access, :set_locale

  private

  def require_login
    if logged_in?
      # renew_aging_session ?
      return
    end

    if request.path == root_path
      @failed_login_email = session[:failed_login]
      session.delete :failed_login
      render "shared/welcome"
    else
      session[:original_request] = request.path
      redirect_to "/auth/google_oauth2"
    end
  end

  def log_access
    unless current_user.nil?
      current_user.update(last_access: Date.today)
    end
  end

  def set_locale
    I18n.locale = current_user.try(:ui_language) || I18n.default_locale
  end

  def response_ok
    head :no_content, status: :ok
  end

  rescue_from "AccessGranted::AccessDenied" do |exception|
    render plain: "Not allowed", status: 401
  end

  rescue_from "ActiveRecord::RecordNotFound" do |exception|
    # logger.error exception.to_s
    render plain: "404 Not Found", status: 404
  end
end
