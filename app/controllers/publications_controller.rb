class PublicationsController < ApplicationController

  before_action :set_program, only: [:index, :new, :create]
  before_action :set_publication, only: [:edit, :update, :destroy, :show]

  def index
    @publications = @program.publications
  end

  def show
    redirect_to program_publications_path(@publication.program, anchor: @publication.kind)
  end

  def new
    @publication = @program.publications.new
    authorize! :create, @publication
  end

  def create
    @publication = @program.publications.new(pub_params)
    authorize! :create, @publication
    if @publication.save
      follow_redirect program_publications_path(@program)
    else
      render :new
    end
  end

  def edit
    authorize! :update, @publication
  end

  def update
    authorize! :update, @publication
    if @publication.update pub_params
      redirect_to program_publications_path @program
    else
      render :edit
    end
  end

  def destroy
    authorize! :destroy, @publication
    @publication.destroy
    redirect_to program_publications_path @program
  end

  private

  def set_program
    @program = Program.find params[:program_id]
  end

  def set_publication
    @publication = Publication.find params[:id]
    @program = @publication.program
  end

  def pub_params
    params.require(:publication).permit(:kind, :media_kind, :english_name, :french_name, :nl_name, :year, :scripture_kind, :film_kind)
  end
end
