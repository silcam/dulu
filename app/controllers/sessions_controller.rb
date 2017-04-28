class SessionsController < ApplicationController
  def new
  end

  def create
    person = Person.find_by(email: params[:session][:email])
    if person && person.has_login
      log_in person
      redirect_to people_path
    else
      render 'new'
    end
  end

  def destroy
    log_out
    redirect_to login_path
  end
end
