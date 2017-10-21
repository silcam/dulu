class DashboardController < ApplicationController

  def dashboard
    @domain = params[:domain] ? params[:domain] : 'Home'
    @user = current_user
  end

end
