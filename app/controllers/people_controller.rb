class PeopleController < ApplicationController
  
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
    params.require(:person).permit(:first_name, :last_name ,:email, :birth_date,
                                  :has_login, :organization_id, :gender, :country_id)
  end

  def logged_in_user
    unless logged_in?
      redirect_to login_url
    end
  end
end
