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

    # Every Api::* controller inherits this before_action too, so the two cases
    # have to be answered differently.
    # An XHR gets a status it can recognise as "not logged in". It used to get
    # the 302 below, which axios follows into a cross-origin Google redirect;
    # rendering the welcome page instead would be worse still, since a 200 of
    # HTML is indistinguishable from real data to DuluAxios. Deliberately narrow
    # -- `unless request.format.html?` looks equivalent but is not: curl and
    # other clients sending a bare `Accept: */*` land on the non-HTML branch and
    # would get a 401 where a browser gets the page. Only an explicit JSON
    # request or an XHR takes this path; anything ambiguous gets the page.
    return head :unauthorized if request.format.json? || request.xhr?

    # A logged-out deep link used to bounce straight to Google. Under OmniAuth 2
    # the request phase is POST-only, and a redirect is always a GET, so it
    # cannot go there any more -- the welcome page's sign-in button has to be
    # clicked instead. session[:original_request] still survives the OAuth round
    # trip in the session cookie, so send_to_correct_page lands the user where
    # they were headed. This costs a logged-out deep link one extra click; it is
    # forced by OmniAuth 2, not a design choice.
    session[:original_request] = request.path unless request.path == root_path
    @failed_login_email = session[:failed_login]
    session.delete :failed_login
    render "shared/welcome"
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
