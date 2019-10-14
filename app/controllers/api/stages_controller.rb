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

  private

  def stage_params
    params.require(:stage).permit(:activity_id, :start_date, :name)
  end
end
