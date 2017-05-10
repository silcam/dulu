class BookTranslationStagesController < ApplicationController
  
  def new
    @book_in_translation = BookInTranslation.find(params[:book_in_translation_id])
    @book_translation_stage = BookTranslationStage.new_for @book_in_translation
  end

end
