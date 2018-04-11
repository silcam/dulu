class Api::ProgramsController < ApplicationController
  def dashboard
    @program = Program.find params[:id]
  end

  def dashboard_list
    @participants = current_user.participants
  end
end
