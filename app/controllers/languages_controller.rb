class LanguagesController < ApplicationController
  def index
    @languages = Language.all.order('name')
  end
end
