class ReportsController < ApplicationController

  def index
    @saved_reports = current_user.reports
  end

  def create
    params_json = JSON.generate(request.parameters)
    name = Report.make_name params
    @report = Report.create(params: params_json, name: name)
    redirect_to @report
  end

  def edit
    @report = Report.find params[:id]
  end

  def show
    @report = Report.find params[:id]
    @saved_reports = current_user.reports.where.not(id: @report.id)
    ViewedReport.mark_viewed @report, current_user
    @data = @report.generate
  end
end
