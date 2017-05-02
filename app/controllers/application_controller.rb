class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include SessionsHelper

  before_action :require_login

  private
    def require_login
      unless logged_in?
        redirect_to login_url
      end
    end
end
