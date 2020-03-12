# frozen_string_literal: true

class Api::EventLocationsController < ApplicationController
  def index
    @locations = EventLocation.all
  end
end
