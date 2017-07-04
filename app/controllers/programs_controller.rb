class ProgramsController < ApplicationController

  def dashboard
    @program = Program.find params[:id]
  end

  def index
    # Sort by recent activity
    @programs = Program.all
    @programs.sort do |a,b|
      if((a.latest_update.nil? && b.latest_update.nil?) ||
          a.latest_update.coincident?(b.latest_update))
        return a.name <=> b.name
      end
      return 1 if a.latest_update.nil?
      return a.latest_update <=> b.latest_update
    end
  end

  def show
    @program = Program.find params[:id]
  end
end
