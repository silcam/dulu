class DashboardController < ApplicationController

  def dashboard
    @domain = params[:dmn] ? params[:dmn] : 'Home'
    @user = current_user
  end

end
