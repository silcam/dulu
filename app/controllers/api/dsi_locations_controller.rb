# frozen_string_literal: true

class Api::DsiLocationsController < ApplicationController
  def index
    @locations = DsiLocation.all
  end
end
