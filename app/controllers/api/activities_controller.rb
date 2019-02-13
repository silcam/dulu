class Api::ActivitiesController < ApplicationController 
  def index
    @language = Language.find(params[:language_id])
  end
  
  def show
    @activity = Activity.find(params[:id])
  end
end
