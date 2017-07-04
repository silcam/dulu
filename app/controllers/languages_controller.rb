class LanguagesController < ApplicationController
  def index
    @languages = Language.all.order('name')
  end

  # Create - create a corresponding program
  
end
