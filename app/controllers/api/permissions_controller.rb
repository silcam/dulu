class Api::PermissionsController < ApplicationController
  def check
    type = params[:type].constantize
    if params[:id]
      @result = can? params[:doWhat].to_sym, type.find(params[:id])
    else
      @result = can? params[:doWhat].to_sym, type
    end
    render json: @result
  end
end