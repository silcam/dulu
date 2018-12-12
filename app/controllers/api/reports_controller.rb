class Api::ReportsController < ApplicationController
  def show
    @report = Report.find(params[:id])
    # @saved_reports = current_user.reports.where.not(id: @report.id)
    ViewedReport.mark_viewed(@report, current_user)
    @data = @report.generate
  end

  def report_data
    if params[:program_id]
      @data = Report.get_program_report(params[:report_type], Program.find(params[:program_id]))
    elsif params[:cluster_id]
      @data = Report.get_cluster_report(params[:report_type], Cluster.find(params[:cluster_id]))
    end
    render json: @data
  end
end