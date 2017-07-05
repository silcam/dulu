class LanguagesController < ApplicationController
  def index
    @languages = Language.all.order('name').includes(:language_status, :country, :cameroon_region)
  end

  # Create - create a corresponding program
  
end
