class Api::StagesController < ApplicationController
  def show
    @stage = Stage.find(params[:id])
  end

  def create
    @stage = Stage.new_stage(stage_params)
    authorize! :update, @stage.activity
    @stage.save!
    render :show
    Notification.new_stage(current_user, @stage)
  end

  def update
    @stage = Stage.find(params[:id])
    authorize! :update, @stage.activity
    @stage.update(stage_params)
    @activity = Activity.find(@stage.activity_id)
    render "api/activities/show"
  end

  def destroy
    @stage = Stage.find(params[:id])
    authorize! :update, @stage.activity
    @stage.destroy
    @activity = Activity.find(@stage.activity_id)
    render "api/activities/show"
  end

  private

  def stage_params
    params.require(:stage).permit(:activity_id, :start_date, :name)
  end
end
