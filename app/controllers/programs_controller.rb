class ProgramsController < ApplicationController

  def index
    @programs = Program.includes(:language).order("languages.name")
  end

  def show
    @program = Program.find params[:id]
  end

  def new
    @program = Program.new
  end

  def edit
  end

  def create
    @program = Program.new(program_params)
    if @program.save
      redirect_to @program
    else
      render 'new'
    end
  end

  private
    def program_params
      params.require(:program).permit(:language_id, :start_date, :name)
    end

end
