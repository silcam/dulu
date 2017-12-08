class Role
  ROLES = %i( Translator TranslationConsultant TranslationConsultantTraining Exegete
              LinguisticConsultant LinguisticConsultantTraining
              LanguageProgramCommittee LanguageProgramFacilitator ClusterCoordinator ClusterFacilitator
              LiteracySpecialist LiteracyConsultant
              ScriptureEngagementSpecialist
              Administration
              SiteAdmin
            )

  EVENT_ROLES = %i( Facilitator Student )

  def self.roles_field(roles)
    return '' if roles.nil?
    roles.join('|')
  end

  def self.roles_from_field(roles_field)
    return [] if roles_field.blank?
    roles_field.split('|').collect{ |r| r.to_sym }
  end

  def self.roles_field_with(roles_field, new_role)
    return new_role if roles_field.blank?
    roles_field + '|' + new_role
  end

  def self.roles_field_without(roles_field, role)
    roles = roles_from_field roles_field
    roles.delete role.to_sym
    roles_field roles
  end

  def self.not_held_by(person)
    ROLES - person.roles
  end

  def self.is_a_role?(role)
    ROLES.include? role.to_sym
  end
end