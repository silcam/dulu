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
    old_people = @activity.people.to_a
    authorize! :update, @activity
    @activity.update!(activity_params)
    @activity.reload
    notify(@activity, old_people)
    render :show
  end

  private

  def activity_params
    params.require(:activity).permit(participant_ids: [])
  end

  def notify(activity, old_people) 
    new_people = activity.people - old_people
    if new_people.length > 0
      Notification.added_people_to_activity(current_user, new_people, activity)
    end
  end
end
