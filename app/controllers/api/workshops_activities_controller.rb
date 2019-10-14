class Api::WorkshopsActivitiesController < ApplicationController
  def index
    @language = Language.find(params[:language_id])
    @workshops_activities = get_workshops_activities
  end

  def show
    @activity = Language.find(params[:id])
  end

  def create
    @language = Language.find(params[:language_id])
    authorize! :create_activity, @language
    @activity = @language.linguistic_activities.create!(workshops_activity_params)
    @workshops_activities = get_workshops_activities
    render :show
    Notification.new_activity(current_user, @activity)
  end

  private

  def workshops_activity_params
    wa_params = params.require(:workshops_activity).permit(:title, { workshops_attributes: [:number, :name] })
    wa_params[:category] = :Workshops
    return wa_params
  end

  def get_workshops_activities
    @language.workshops_activities
  end
end
