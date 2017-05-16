class BookTranslationStagesController < ApplicationController
  
  def new
    @book_in_translation = BookInTranslation.find(params[:book_in_translation_id])
    @book_translation_stage = BookTranslationStage.new_for @book_in_translation
  end

  def create
    @book_in_translation = BookInTranslation.find(params[:book_in_translation_id])
    if @book_in_translation.book_translation_stages.create(book_translation_stage_params)
      redirect_to @book_in_translation.program
    else
      render 'new'
    end
  end

  private
    def book_translation_stage_params
      params.require(:book_translation_stage).permit(:stage_name_id, :start_date)
    end

end
