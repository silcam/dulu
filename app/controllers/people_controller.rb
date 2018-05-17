class PeopleController < ApplicationController
  def index
    @people = Person.all.includes(:organization)
  end

  def show
    @person = Person.find params[:id]
    respond_to do |format|
      format.html { render 'index' }
      format.json { render json: @person.to_hash }
    end
  end
  alias edit show

  def not_allowed

  end

private

  def logged_in_user
    unless logged_in?
      redirect_to login_url
    end
  end
end
