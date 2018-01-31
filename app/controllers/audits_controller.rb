class AuditsController < ApplicationController
  before_action :authorize

  def index
    @audits = Audited::Audit.order(created_at: :desc).page(params[:page])
  end

  def show
    @audit = Audited::Audit.find params[:id]
  end

  def authorize
    authorize! :read, Audited::Audit
  end
end
