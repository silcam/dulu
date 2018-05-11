class Api::CountriesController < ApplicationController
  def search
    @countries = Country.search(params[:q])
  end
end