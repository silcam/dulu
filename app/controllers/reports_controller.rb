class ReportsController < ApplicationController

  def index
    if params[:type]
      @data = Report.generate(params)
      render 'report'
    else
      render 'index'
    end
  end
end
