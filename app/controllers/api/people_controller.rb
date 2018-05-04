class Api::PeopleController < ApplicationController
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
    end
  end

  def update
    @person = Person.find(params[:id])
    authorize! :update, @person
    @person.update(person_params)
    @person.reload unless @person.valid?
    render :show
  end

  def destroy
    @person = Person.find(params[:id])
    authorize! :destroy, @person
    @person.destroy!
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