class TranslationActivity < Activity

  belongs_to :bible_book
  has_many :book_translation_consultants

  def current_translation_stage
    self.translation_stages.last
  end

  def self.add_new_to_program(program, bible_book_id)
    new_book = program.translation_activities.create!(bible_book_id: bible_book_id)
    new_book.translation_stages.create!(Stage.default_new_params)
  end

  def name
    self.bible_book.name
  end

  def progress
    self.current_translation_stage.progress
  end

  def stage_name
    self.current_translation_stage.name
  end

  def pers_prog_rels_for_my_stage
    self.pers_prog_rels.where(program_role: current_translation_stage.program_roles)
  end
end
