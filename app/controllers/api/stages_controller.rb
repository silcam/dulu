class Api::StagesController < ApplicationController
  def show
    @stage = Stage.find(params[:id])
  end

  def create
    @stage = Stage.new_stage(stage_params)
    authorize! :update, @stage.activity
    @stage.save!
    render :show
  end

  private

  def stage_params
    params.require(:stage).permit(:activity_id, :start_date, :name)
  end
end