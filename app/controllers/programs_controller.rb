class ProgramsController < ApplicationController

  def dashboard
    @program = Program.find params[:id]
    render :dashboard
  end
  alias show dashboard

  def index
    @programs = Program.all_sorted_by_recency
  end
end
