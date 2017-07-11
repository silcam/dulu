class PeopleController < ApplicationController
  before_action :set_person, only: [:show, :edit, :update]

  def index
    @people = Person.all.order(:last_name, :first_name).includes(:organization)
  end

  def show
  end

  # noinspection RubyArgCount
  def new
    authorize! :create, Person
    @person = Person.new
  end

  def edit
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
    authorize! :update, @person
    if @person.update(person_params)
      follow_redirect people_path
    else
      render 'edit'
    end
  end

  def dashboard
    @user = current_user
    render @user.current_participants.empty? ? 'searches/search' : 'dashboard'
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

  def set_person
    @person = Person.find params[:id]
  end

  def logged_in_user
    unless logged_in?
      redirect_to login_url
    end
  end
end
