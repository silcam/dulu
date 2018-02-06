class Stage < ApplicationRecord

  belongs_to :activity, required: true, touch: true
  has_one :workshop # For Workshop type Linguistic Activities
  # has_many :program_roles, through: :stage_name

  LINGUISTIC_STAGES = %i( Planned Research Drafting Review Published )
  MEDIA_STAGES = %i( Planned Application Script Scheduled Recording Mastering Published )
  TRANSLATION_STAGES = %i( Planned Drafting Testing Review_committee Back_translating Ready_for_consultant_check
                            Consultant_check Consultant_checked Published )

  # LINGUISTIC_STAGE_ROLES = {
  #                       Research: [:LinguisticConsultant, :LinguisticConsultantTraining],
  #                       Drafting:  [:LinguisticConsultant, :LinguisticConsultantTraining],
  #                       Review:  [:LinguisticConsultant, :LinguisticConsultantTraining]
  # }
  #
  # MEDIA_STAGE_ROLES = {
  #                   Application: [:MediaConsultant, :MediaSpecialist],
  #                   Script:  [:MediaConsultant, :MediaSpecialist],
  #                   Scheduled:  [:MediaConsultant, :MediaSpecialist],
  #                   Recording:  [:MediaConsultant, :MediaSpecialist],
  #                   Mastering:  [:MediaConsultant, :MediaSpecialist]
  # }

  TRANSLATION_STAGE_ROLES = {
                              Drafting: [:Translator],
                              Testing: [:Translator],
                              Back_translating: [:Translator],
                              Ready_for_consultant_check: [:TranslationConsultant, :TranslationConsultantTraining, :Exegete],
                              Consultant_check: [:TranslationConsultant, :TranslationConsultantTraining, :Exegete],
                              Consultant_checked: [:TranslationConsultant, :TranslationConsultantTraining, :Exegete]
                            }


  audited associated_with: :activity

  validates :start_date, presence: {message: "year can't be blank"}, allow_blank: false
  validates :start_date, fuzzy_date: true
  validates :kind, inclusion: [:Translation, :Linguistic, :Media]
  # validate :name_is_on_the_list

  def kind
    self.attributes['kind'].try(:to_sym)
  end

  def name
    self.attributes['name'].try(:to_sym)
  end

  def f_start_date
    begin
      FuzzyDate.from_string start_date
    rescue FuzzyDateException
      nil
    end
  end

  def progress
    case kind
      when :Translation
        return Stage.translation_progress(name)
      when :Linguistic
        return Stage.linguistic_progress(name)
      when :Media
        return Stage.media_progress(name)
    end
  end

  def roles
    case kind
      when :Translation
        TRANSLATION_STAGE_ROLES[name] || []
      when :Linguistic
        [:LinguisticConsultant, :LinguisticConsultantTraining]
      when :Media
        [:MediaConsultant, :MediaSpecialist]
    end
  end

  def self.first_stage(kind)
    stages(kind).first
  end

  def self.last_stage(kind)
    stages(kind).last
  end

  def self.stage_after(stage, kind)
    stages = stages(kind)
    stage = stage.to_sym
    (stage == stages.last) ? stage : stages[stages.index(stage.to_sym) + 1]
  end

  def self.stages(kind)
    case kind.to_sym
      when :Translation
        TRANSLATION_STAGES
      when :Linguistic
        LINGUISTIC_STAGES
      when :Media
        MEDIA_STAGES
    end
  end

  def self.progress(kind, stage_name)
    case kind
      when :Translation
        return translation_progress(stage_name)
      when :Linguistic
        return linguistic_progress(stage_name)
      when :Media
        return media_progress(stage_name)
    end

  end

  private

  def self.translation_progress(name)
    case name
      when :Planned
        return 0, :white
      when :Drafting
        return 10, :red
      when :Testing
        return 20, :orange
      when :Review_committee
        return 40, :yellow
      when :Back_translating
        return 60, :light_green
      when :Ready_for_consultant_check
        return 75, :dark_green
      when :Consultant_check
        return 75, :light_blue
      when :Consultant_checked
        return 95, :dark_blue
    end
    return 100, :purple
  end

  def self.linguistic_progress(name)
    case name
      when :Planned
        return 0, :white
      when :Research
        return 25, :red
      when :Drafting
        return 50, :yellow
      when :Review
        return 75, :light_blue
      when :Published
        return 100, :purple
    end
  end

  def self.media_progress(name)
    case name
      when :Planned
        return 0, :white
      when :Application
        return 20, :red
      when :Script
        return 40, :orange
      when :Scheduled
        return 50, :yellow
      when :Recording
        return 60, :light_green
      when :Mastering
        return 80, :light_blue
      when :Published
        return 100, :purple

    end
  end

  # def generic_progress
  #   return (100 * level) / StageName.last_stage(kind).level, :blue
  # end
end
