class SessionsController < ApplicationController
  
  skip_before_action :require_login, only: [:new, :create]

  def new
    if logged_in?
      redirect_to root_path
    end
  end

  def create
    person = Person.find_by(email: params[:session][:email])
    if person && person.has_login
      log_in person
      send_to_correct_page
    else
      render 'new'
    end
  end

  def send_to_correct_page
    if session[:original_request]
      redirect_to session[:original_request]
      session.delete(:original_request)
    else
      redirect_to root_path
    end
  end

  def destroy
    log_out
    redirect_to login_path
  end
end
