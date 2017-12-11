class Role
  ROLES = %i( Translator TranslationConsultant TranslationConsultantTraining Exegete
              LinguisticConsultant LinguisticConsultantTraining
              LanguageProgramCommittee LanguageProgramFacilitator Cluster_coordinator Cluster_facilitator
              Literacy_specialist Literacy_consultant
              Scripture_engagement_specialist
              Administration
            )

  EVENT_ROLES = %i( Facilitator Student )

  def self.program_roles
    ROLES - [:Administration]
  end

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

  def self.available(assign_to, source=ROLES)
    source - assign_to.roles
  end

  def self.is_a_role?(role)
    ROLES.include? role.to_sym
  end

  def self.has_a_program_role?(person)
    arrays_overlap? program_roles, person.roles
  end

  private

  def arrays_overlap?(a1, a2)
    a1.each do |item|
      return true if a2.include? item
    end
    false
  end
end