class Api::WorkshopsController < ApplicationController

  def index
    @activity = Activity.find(params[:activity_id])
    @workshops = Workshop.sort @activity.workshops
  end

  def create
    activity = Activity.find(params[:activity_id])
    authorize! :update, activity
    number = activity.workshops.last.number + 1
    @workshop = activity.workshops.create(workshop_params.merge(number: number))
  end

  def update
    @workshop = Workshop.find(params[:id])
    authorize! :update, @workshop.linguistic_activity
    @workshop.update(workshop_params)
    update_completion_and_notify
  end

  def destroy
    @workshop = Workshop.find(params[:id])
    authorize! :update, @workshop.linguistic_activity
    @workshop.destroy
    head :no_content, status: :ok
  end

  private

  def workshop_params
    params.require(:workshop).permit(:name)
  end

  def update_completion_and_notify
    was_complete = @workshop.completed?
    @workshop.update_completion(params[:workshop][:completed], params[:workshop][:date])
    if !was_complete && @workshop.completed?
      Notification.workshop_complete current_user, @workshop
    end
  end
end
