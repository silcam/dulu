class TranslationStagesController < ApplicationController
  
  def new
    @book_in_translation = BookInTranslation.find(params[:book_in_translation_id])
    @translation_stage = TranslationStage.new_for @book_in_translation
  end

  def create
    @book_in_translation = BookInTranslation.find(params[:book_in_translation_id])
    if @book_in_translation.translation_stages.create(translation_stage_params)
      redirect_to @book_in_translation.program
    else
      render 'new'
    end
  end

  private
    def translation_stage_params
      params.require(:translation_stage).permit(:stage_name_id, :start_date)
    end

end
