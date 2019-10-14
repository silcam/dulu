class Api::ErrorsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    if Rails.env.production?
      ErrorMailer.error_report(params[:content]).deliver_now
      # ErrorMailer.delay.error_report(params[:content])
    end
  end
end
