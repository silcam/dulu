class Api::ResearchActivitiesController < ApplicationController
  def index
    @program = Program.find(params[:program_id])
    @research_activities = @program.research_activities
  end

  def create
    @program = Program.find(params[:program_id])
    authorize! :create_activity, @program
    @program.linguistic_activities.create!(research_activity_params)
    @research_activities = @program.research_activities
    render :index
  end

  private

  def research_activity_params
    ra_params = params.require(:research_activity).permit(:title)
    ra_params[:category] = :Research
    return ra_params
  end
end