module HasRoles
  extend ActiveSupport::Concern

  def roles
    return [] if roles_field.blank?
    roles_field[1..-1].split('|').collect{ |r| r.to_sym }
  end

  def program_roles
    Role.program_roles(roles)
  end

  def roles_text
    roles.collect{ |r| I18n.t(r) }.join(', ')
  end

  def has_role?(role)
    roles.include? role.to_sym
  end

  def has_role_among?(roles)
    Role.roles_overlap?(self.roles, roles)
  end

  def add_to_roles_field(new_role)
    r_field = roles_field.blank? ? '|' : roles_field
    r_field += new_role.to_s + '|'
    update! roles_field: r_field
  end
  alias add_role add_to_roles_field

  def remove_from_roles_field(role)
    roles = self.roles
    roles.delete role.to_sym
    update roles_field: make_roles_field(roles)
  end
  alias remove_role remove_from_roles_field

  def make_roles_field(roles)
    self.class.make_roles_field(roles)
  end

  class_methods do
    def make_roles_field(roles)
      return '' if roles.nil? || roles.empty?
      '|' + roles.join('|') + '|'
    end

    def where_has_role(role)
      where('roles_field LIKE ?', "%|#{role}|%")
    end

    def where_has_role_among(roles)
      return [] if roles.empty?
      search = roles.collect{ |r| 'roles_field LIKE ?'}.join(' OR ')
      roles = roles.collect{ |r| "%|#{r}|%"}
      where(search, *roles)
    end
  end

  # def has_program_role?
  #   Role.has_a_program_role? self
  # end
end