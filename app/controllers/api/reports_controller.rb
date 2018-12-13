class Api::ReportsController < ApplicationController
  def create
    @report = Report.new(report_params)
    @report.author = current_user
    @report.save!
    render json: { report: {id: @report.id}}
  end

  def index
    @reports = current_user.reports
  end

  def show
    @report = Report.find(params[:id])
    ViewedReport.mark_viewed(@report, current_user)
  end

  def report_data
    if params[:program_id]
      @data = Report.get_program_report(params[:report_type], Program.find(params[:program_id]))
    elsif params[:cluster_id]
      @data = Report.get_cluster_report(params[:report_type], Cluster.find(params[:cluster_id]))
    end
    render json: @data
  end

  private

  def report_params
    params.require(:report).permit(:name, report: {})
  end
end