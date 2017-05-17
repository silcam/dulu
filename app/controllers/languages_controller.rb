class LanguagesController < ApplicationController
  def index
    @languages = Language.all.order('name')
  end

  def dashboard
  end
  
end
