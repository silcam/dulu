class PeopleController < ApplicationController

  before_action :logged_in_user  #TODO - move this to application controller

  def index
    @people = Person.all.order("last_name ASC")
  end

  def new
    @person = Person.new
  end

  def edit
    @person = Person.find(params[:id])
  end

  def create
    @person = Person.new(person_params)
    if @person.save
      redirect_to people_path
    else
      render 'new'
    end
  end

  def update
    @person = Person.find(params[:id])
    if @person.update(person_params)
      redirect_to people_path
    else
      render 'edit'
    end
  end

private
  def person_params
    params.require(:person).permit(:first_name, :last_name ,:email, :has_login)
  end

  def logged_in_user
    unless logged_in?
      redirect_to login_url
    end
  end
end
