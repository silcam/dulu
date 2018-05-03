class Api::PeopleController < ApplicationController
  def index
    @people = Person.all
  end

  def show
    @person = Person.find(params[:id])
  end

  def update
    @person = Person.find(params[:id])
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
                                   :email, 
                                   :country_id,
                                   :has_login,
                                   :ui_language,
                                   :email_pref)
  end
end