# frozen_string_literal: true

class Api::LanguagesController < ApplicationController
  def index
    @languages = Language.all
  end

  def show
    @language = Language.find(params[:id])
  end

  def dashboard_list; end

  def search
    @languages = Language.basic_search(params[:q])
  end
end
