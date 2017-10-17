class DomainUpdatesController < ApplicationController

  before_action :set_program, only: [:index, :new, :create]
  before_action :set_domain_update, only: [:edit, :update, :destroy]

  def index
    @domain_updates = @program.domain_updates.includes(:status_parameter)
  end

  def new
    @domain = params[:dmn]
    @survey = Survey.find(params[:survey]) if params[:survey]
    redirect_to program_domain_updates_path(@program) unless StatusParameter.domains.include? @domain
    authorize! :create, @program.domain_updates.new
  end

  def create
    authorize! :create, @program.domain_updates.new
    @domain = params[:domain]
    @domain_updates_with_errors = []
    assemble_dates params, 'domain_update', 'date'
    params[:domain_updates].each do |key, du_params|
      if du_params.any?{ |key, val| not val.blank? }
        domain_update = @program.domain_updates.new(domain_update_params(du_params))
        domain_update.date = params[:domain_update][:date]
        domain_update.domain = @domain
        domain_update.status_parameter_id = key if StatusParameter.find_by id: key
        @domain_updates_with_errors << domain_update unless domain_update.save
      end
    end
    if @domain_updates_with_errors.empty?
      follow_redirect program_domain_updates_path(@program)
    else
      render :new
    end
  end

  def edit
    authorize! :update, @domain_update
  end

  def update
    authorize! :update, @domain_update
    assemble_dates params, 'domain_update', 'date'
    if @domain_update.update domain_update_params params[:domain_update]
      redirect_to program_domain_updates_path @program
    else
      render :edit
    end
  end

  def destroy
    authorize! :destroy, @domain_update
    @domain_update.destroy
    redirect_to program_domain_updates_path @program
  end

  private

  def set_program
    @program = Program.find params[:program_id]
  end

  def set_domain_update
    @domain_update = DomainUpdate.find params[:id]
    @program = @domain_update.program
  end

  def domain_update_params(params)
    params.permit(:status_parameter_id, :number, :status, :note, :date)
  end
end
