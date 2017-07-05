class ProgramsController < ApplicationController

  def dashboard
    @program = Program.find params[:id]
  end

  def index
    @programs = Program.all_sorted_by_recency
  end

  def show
    @program = Program.find params[:id]
  end
end
