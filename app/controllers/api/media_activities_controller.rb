class Api::MediaActivitiesController < ApplicationController

  def index
    @program = Program.find(params[:program_id])
    @media_activities = @program.media_activities
  end

  def create
    @program = Program.find(params[:program_id])
    authorize! :create_activity, @program
    @program.media_activities.create!(media_activity_params)
    @media_activities = @program.media_activities
    render :index
  end

  private

  def media_activity_params
    return params.require(:media_activity).permit(:category, :scripture, :film)
  end
end