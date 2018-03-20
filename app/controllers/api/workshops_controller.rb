class Api::WorkshopsController < ApplicationController

  def index
    activity = Activity.find(params[:activity_id])
    @workshops = activity.workshops
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
end
