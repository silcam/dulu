class AuditsController < ApplicationController
  before_action :authorize

  def index
    page_size = 50
    @page = params[:page] || 1
    offset = (@page - 1) * page_size
    @audits = Audited::Audit.order(created_at: :desc).offset(offset).limit(page_size)
    @pages = (Audited::Audit.count / page_size.to_f).ceil
  end

  def show
    @audit = Audited::Audit.find params[:id]
  end

  def authorize
    authorize! :read, Audited::Audit
  end
end
