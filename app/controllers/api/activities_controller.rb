class Api::ActivitiesController < ApplicationController 
  def index
    @language = Language.find(params[:language_id])
    @domain = params[:domain] || 'all'
  end
  
  def show
    @activity = Activity.find(params[:id])
  end

  def update
    @activity = Activity.find(params[:id])
    authorize! :update, @activity
    @activity.update!(activity_params)
    render :show
  end

  private

  def activity_params
    params.require(:activity).permit(participant_ids: [])
  end
end
