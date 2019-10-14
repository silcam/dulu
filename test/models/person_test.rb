require "test_helper"

class PersonTest < ActiveSupport::TestCase
  def setup
    @drew = people :Drew
    I18n.locale = :en
  end

  test "Relations" do
    sil = organizations :SIL
    usa = countries :USA
    drew_hdi = participants :DrewHdi

    assert_equal sil, @drew.organizations.first
    assert_equal usa, @drew.country
    assert_includes @drew.participants, drew_hdi
  end

  test "Invalid People" do
    cm = countries(:Cameroon)
    invalid_person = Person.new(last_name: "Jones", gender: "M", country: cm)
    refute invalid_person.save, "Shouldn't save person with no first name"
    invalid_person = Person.new(first_name: "Bill", gender: "M", country: cm)
    refute invalid_person.save, "Shouldn't save person with no last name"
    invalid_person = Person.new(last_name: "Jones", first_name: "Bill", gender: "A", country: cm)
    refute invalid_person.save, "Shouldn't save person with invalid gender"
    valid_person = Person.new(last_name: "Johnes", first_name: "Bill", gender: "M", country: cm)
    assert valid_person.save, "Should save valid person"
  end

  test "Duplicate Email" do
    drew2 = Person.new(last_name: "Mambo", first_name: "DrewToo", gender: "M", email: "drew_mambo@sil.org")
    refute drew2.save, "Should not save person with duplicate email"
    drew2.email = "drew_mambo_too@sil.org"
    assert drew2.save, "Should save with unique email."
  end

  test "Full Names" do
    assert_equal "Drew Mambo", @drew.full_name
    assert_equal "Mambo, Drew", @drew.full_name_rev
  end

  test "Default Scope" do
    kevin = people :Lance
    assert_equal kevin, Person.first
  end

  test "Has Login" do
    abanda = people :Abanda
    assert @drew.has_login, "Drew should have a login"
    refute abanda.has_login, "Abanda does not have a login"
  end

  test "Add Role" do
    @drew.add_role("DuluAdmin")
    exp = "|TranslationConsultant|DuluAdmin|"
    assert_equal exp, @drew.roles_field
    assert PersonRole.current.find_by(person: @drew, role: "DuluAdmin")

    @drew.add_role(:Exegete)
    assert @drew.has_role? :Exegete

    kevin = people(:Kevin)
    kevin.add_role(:Administration)
    assert kevin.has_role? :Administration
    assert PersonRole.current.find_by(person: kevin, role: :Administration)
  end

  test "Remove Role" do
    @drew.remove_role("TranslationConsultant")
    assert_empty @drew.roles
    assert_equal "", @drew.roles_field
    assert_equal Date.today,
                 PersonRole.find_by(person: @drew, role: :TranslationConsultant).end_date
    refute PersonRole.current.find_by(person: @drew, role: :TranslationConsultant)

    @drew.add_role :DuluAdmin
    @drew.add_role :Translator
    @drew.add_role :Exegete

    @drew.remove_role :Translator
    exp = "|DuluAdmin|Exegete|"
    assert_equal exp, @drew.roles_field
    assert_equal 2, @drew.person_roles.current.count

    @drew.remove_role "Exegete"
    exp = "|DuluAdmin|"
    assert_equal exp, @drew.roles_field
  end

  test "Current Participants" do
    no_participants = people(:FormerHdiTranslator).current_participants
    participants = people(:Drew).current_participants

    assert_empty no_participants
    assert_not_empty participants
  end

  test "Current Languages" do
    ndop = clusters :Ndop
    drew_languages = @drew.current_languages
    assert_includes drew_languages, languages(:Hdi)
    assert_includes drew_languages, languages(:Bangolan)

    assert_empty people(:Kevin).current_languages
  end

  test "To Hash" do
    @drew.add_role :DuluAdmin
    exp = {
            id: @drew.id,
            first_name: "Drew",
            last_name: "Mambo",
            roles: [{
                      role: :TranslationConsultant,
                      t_role: "Translation Consultant",
                    },
                    {
                      role: :DuluAdmin,
                      t_role: "Dulu Admin",
                    }],
          }
    assert_equal exp, @drew.to_hash
  end

  test "Search" do
    results = Person.search "drew"
    assert_equal 1, results.count
    assert_equal "Drew Mambo", results[0][:title]
    hdi_language = languages :Hdi
    assert_includes results[0][:subresults],
                    { title: "Hdi", model: hdi_language,
                      description: "Translation Consultant" }
  end
end
