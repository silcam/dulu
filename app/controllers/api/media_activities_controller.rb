class Api::MediaActivitiesController < ApplicationController
  def index
    @language = Language.find(params[:language_id])
    @media_activities = @language.media_activities
  end

  def show
    @activity = Activity.find(params[:id])
  end

  def create
    @language = Language.find(params[:language_id])
    authorize! :create_activity, @language
    @activity = @language.media_activities.create!(media_activity_params)
    @media_activities = @language.media_activities
    render :show
    Notification.new_activity(current_user, @activity)
  end

  private

  def media_activity_params
    return params.require(:media_activity).permit(:category, :scripture, :film, bible_book_ids: [])
  end
end
