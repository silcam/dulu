class PeopleController < ApplicationController

  def index
    
  end

  def new

  end

  def create

  end

private
  def person_params
    params.require(:person).permit(:first_name, :last_name)
  end
end
