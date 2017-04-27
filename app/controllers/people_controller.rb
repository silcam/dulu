class PeopleController < ApplicationController

  def index
    @people = Person.all
  end

  def new

  end

  def create
    @person = Person.new(person_params)
    if @person.save
      redirect_to people_path
    else
      render 'new'
    end
  end

private
  def person_params
    params.require(:person).permit(:first_name, :last_name)
  end
end
