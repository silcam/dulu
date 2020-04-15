# frozen_string_literal: true

class Api::WorkshopsController < ApplicationController
  def create
    @activity = Activity.find(params[:activity_id])
    authorize! :update, @activity
    @workshop = @activity.workshops.create!(workshop_params)
    render 'api/activities/show'
  end

  def update
    @workshop = Workshop.find(params[:id])
    authorize! :update, @workshop.linguistic_activity
    @workshop.update(workshop_params)
    update_completion_and_notify
    @activity = @workshop.linguistic_activity
    render 'api/activities/show'
  end

  def destroy
    @workshop = Workshop.find(params[:id])
    authorize! :update, @workshop.linguistic_activity
    @workshop.destroy
    @activity = @workshop.linguistic_activity
    render 'api/activities/show'
  end

  private

  def workshop_params
    params.require(:workshop).permit(:name)
  end

  def update_completion_and_notify
    was_complete = @workshop.completed?
    @workshop.update_completion(params[:workshop][:completed], params[:workshop][:date])
    Notification.workshop_complete current_user, @workshop if !was_complete && @workshop.completed?
  end
end
