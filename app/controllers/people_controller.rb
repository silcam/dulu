class PeopleController < ApplicationController
  
  def index
    @people = Person.all.order("last_name ASC")
  end

  def new
    authorize! :create, Person
    @person = Person.new
  end

  def edit
    @person = Person.find(params[:id])
    authorize! :update, @person
  end

  def create
    authorize! :create, Person
    @person = Person.new(person_params)
    if @person.save
      follow_redirect people_path, person_id: @person.id
    else
      render 'new'
    end
  end

  def update
    @person = Person.find(params[:id])
    authorize! :update, @person
    if @person.update(person_params)
      redirect_to people_path
    else
      render 'edit'
    end
  end

  def dashboard
    @user = current_user
  end

  def not_allowed

  end

private
  def person_params
    authorize!(:grant_admin, Person) if params[:person][:role] == Person::ROLES.index(:admin).to_s
    params.require(:person).permit(:first_name, :last_name ,:email, :birth_date,
                                  :organization_id, :gender, :country_id,
                                  :role, :ui_language)
  end

  def logged_in_user
    unless logged_in?
      redirect_to login_url
    end
  end
end
