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
    @db_report = Report.find(params[:id])
    ViewedReport.mark_viewed(@db_report, current_user)
    case @db_report.report['type']
    when 'Domain'
      @report = DomainReport.from_database(@db_report)
      @report.generate
      render :domain_report
    when 'LanguageComparison'
      render :translation_progress_report
    else
      raise "Unknown report type #{@db_report.report['type']} for report {#{@db_report.id}}." 
    end
  end

  def report_data
    if params[:language_id]
      @data = Report.get_language_report(params[:report_type], Language.find(params[:language_id]))
    elsif params[:cluster_id]
      @data = Report.get_cluster_report(params[:report_type], Cluster.find(params[:cluster_id]))
    end
    render json: @data
  end

  def domain_report
    @report = DomainReport.from_web_params(params)
    @report.generate
  end

  private

  def report_params
    params.require(:report).permit(:name, report: {})
  end
end