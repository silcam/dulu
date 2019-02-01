class Api::ResearchActivitiesController < ApplicationController
  def index
    @language = Language.find(params[:language_id])
    @research_activities = @language.research_activities
  end

  def create
    @language = Language.find(params[:language_id])
    authorize! :create_activity, @language
    @activity = @language.linguistic_activities.create!(research_activity_params)
    @research_activities = @language.research_activities
    render :index
    Notification.new_activity(current_user, @activity)
  end

  private

  def research_activity_params
    ra_params = params.require(:research_activity).permit(:title)
    ra_params[:category] = :Research
    return ra_params
  end
end