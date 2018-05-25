class Api::PeopleController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:update_view_prefs]

  def index
    @people = Person.all
  end

  def show
    @person = Person.find(params[:id])
  end

  def create
    authorize! :create, Person
    @person = Person.new(person_params)
    if duplicate_person?
      render :duplicate
    else
      @person.save!
      NotificationMailer.delay.welcome(@person, current_user) if @person.has_login
    end
  end

  def update
    @person = Person.find(params[:id])
    authorize! :update, @person
    had_login = @person.has_login
    if @person.update(person_params)
      Notification.updated_you(current_user, @person)
      NotificationMailer.delay.welcome(@person, current_user) if !had_login && @person.has_login
    else
      @person.reload
    end
    render :show
  end

  def destroy
    @person = Person.find(params[:id])
    authorize! :destroy, @person
    @person.destroy!
    head :no_content, status: :ok
  end

  def update_view_prefs
    params.permit!
    current_user.view_prefs.merge!(params[:view_prefs])
    current_user.save
    head :no_content, status: :ok
  end

  private

  def person_params
    params.require(:person).permit(:first_name, 
                                   :last_name, 
                                   :gender,
                                   :email, 
                                   :country_id,
                                   :has_login,
                                   :ui_language,
                                   :email_pref)
  end

  def duplicate_person?
    return false if params[:person][:not_a_duplicate]
    @duplicate = Person.find_by("first_name ILIKE ? AND last_name ILIKE ?",
                                @person.first_name,
                                @person.last_name)
    return @duplicate
  end
end