# frozen_string_literal: true

require 'test_helper'

class NotificationTest < ActiveSupport::TestCase
  include ApplicationHelper

  def mp(*args)
    model_path(*args)
  end

  def setup
    @drew = people :Drew
    @johncarlos = people :JohnCarlos
    @rick = people :Rick
    @lance = people :Lance
    @andreas = people :Andreas
    @hdi = languages :Hdi
    @abanda = people :Abanda
    @nancy = people :Nancy
    I18n.locale = :en
  end

  test 'Notification Text' do
    ntfn = Notification.new(english: '[Rick Conrad](/people/1) likes pizza.', french: '[Rick Conrad](/people/1) aime le pizza.')
    assert_equal '[Rick Conrad](/people/1) likes pizza.', ntfn.text
    assert_equal '[Rick Conrad](/people/1) aime le pizza.', ntfn.text(:fr)
    assert_equal 'Rick Conrad aime le pizza.', ntfn.simple_text(:fr)
    assert_equal "<a href='/people/1'>Rick Conrad</a> aime le pizza.", ntfn.html(:fr)
    assert_equal "<a href='https://dulu.sil.org/people/1'>Rick Conrad</a> aime le pizza.", ntfn.html(:fr, 'https://dulu.sil.org')
  end

  test 'New Participant Language' do
    lance_hdi = Participant.create(
      person: @lance, 
      language: @hdi, 
      start_date: '2018', 
      roles: ['TranslationConsultant']
    )
    Notification.new_language_participant(@drew, lance_hdi)
    ntfn = Notification.last
    assert_equal(
      "[Drew Mambo](#{mp(@drew)}) added [Lance Armstrong](#{mp(lance_hdi)}) to the [Hdi](#{mp(@hdi)}) language.",
      ntfn.english
    )
    assert_equal(
      "[Drew Mambo](#{mp(@drew)}) a ajouté [Lance Armstrong](#{mp(lance_hdi)}) au programme [Hdi](#{mp(@hdi)}).", 
      ntfn.french
    )
    assert_equal "Lng#{@hdi.id} Reg#{regions(:NorthRegion).id} DTra ", ntfn.channels
    assert_equal @drew, ntfn.creator
    assert_equal [ntfn], @drew.created_notifications
    assert_equal 6, PersonNotification.count
    assert_includes @drew.notifications, ntfn
    assert_includes @lance.notifications, ntfn
    assert_includes @abanda.notifications, ntfn
    assert_includes @andreas.notifications, ntfn
    assert_includes @nancy.notifications, ntfn
    assert_equal true, @drew.person_notifications.last.read
    assert_equal false, @andreas.person_notifications.last.read
  end

  test 'New Participant Cluster' do
    ndop = clusters :Ndop
    kendall_ndop = Participant.create(
      person: people(:Kendall), 
      cluster: ndop, 
      start_date: '2018', 
      roles: ['TranslationConsultant']
    )
    Notification.new_cluster_participant(@drew, kendall_ndop)
    ntfn = Notification.last
    assert_equal "[Drew Mambo](#{mp(@drew)}) added [Kendall Ingles](#{mp(kendall_ndop)}) to the [Ndop](#{mp(ndop)}) cluster.", ntfn.english
    assert_equal "[Drew Mambo](/people/883742519) a ajouté [Kendall Ingles](#{mp(kendall_ndop)}) au groupe [Ndop](/clusters/657561020).", ntfn.french
    assert_includes people(:Freddie).notifications, ntfn
    assert_includes @nancy.notifications, ntfn
  end

  test 'New Stage' do
    ezra_testing = Stage.create!(
      activity: translation_activities(:HdiEzra),
      start_date: '2018',
      name: :Testing,
      kind: :Translation
    )
    Notification.new_stage(@drew, ezra_testing)
    ntfn = Notification.last
    assert_equal "[Drew Mambo](#{mp(@drew)}) updated [Ezra](#{mp(ezra_testing.activity)}) to the Testing stage for the [Hdi](#{mp(@hdi)}) program.", ntfn.english
    assert_equal '[Drew Mambo](/people/883742519) a mis à jour [Esdras](/translation_activities/1071624995) à Testing pour le programme [Hdi](/languages/876048951).', ntfn.french
    assert_includes people(:Abanda).notifications, ntfn
    assert_includes people(:Nancy).notifications, ntfn
  end

  test 'New Stage from Francophone' do
    ezra_review = Stage.create!(
      activity: translation_activities(:HdiEzra),
      start_date: '2019',
      name: :Review_committee,
      kind: :Translation
    )
    Notification.new_stage(@johncarlos, ezra_review)
    ntfn = Notification.last
    assert_equal "[JohnCarlos Gerber](#{mp(@johncarlos)}) updated [Ezra](#{mp(ezra_review.activity)}) to the Review Committee stage for the [Hdi](#{mp(@hdi)}) program.", ntfn.english
    assert_equal "[JohnCarlos Gerber](#{mp(@johncarlos)}) a mis à jour [Esdras](#{mp(ezra_review.activity)}) à Comité de révision pour le programme [Hdi](#{mp(@hdi)}).", ntfn.french
    assert_includes people(:Abanda).notifications, ntfn
    assert_includes people(:Nancy).notifications, ntfn
  end

  test 'Translation Test from French locale' do
    I18n.locale = :fr
    assert_equal("Ezra", I18n.t("Ezra", { :locale => :en }), "should not give translation missing error")
    assert_equal("Esdras", I18n.t("Ezra", { :locale => :fr }), "should not give translation missing error")
  end

  test 'Workshop Complete' do
    verbshop = workshops(:Verb)
    verbshop.complete({})
    Notification.workshop_complete(@rick, verbshop)
    ntfn = Notification.last
    assert_equal(
      "[Rick Conrad](#{mp(@rick)}) updated the [Verb](#{mp(verbshop.linguistic_activity)}) workshop for the [Ewondo](#{mp(languages(:Ewondo))}) program as complete.",
      ntfn.english
    )
    assert_equal(
      "[Rick Conrad](/people/334915632) a mis à jour l'atelier [Verb](/linguistic_activities/364981178) pour le programme [Ewondo](/languages/406181303) comme réalisé.",
      ntfn.french
    )
    assert_includes people(:Kendall).notifications, ntfn
  end

  test 'New Activity' do
    @nancy.add_notification_channel(NotificationChannel.domain_channel(:Linguistics))
    dvu_study = LinguisticActivity.create(category: :Research, title: 'Dvu', language: @hdi)
    Notification.new_activity(@drew, dvu_study)
    ntfn = Notification.last
    assert_equal(
      "[Drew Mambo](#{mp(@drew)}) added a new activity to the [Hdi](#{mp(@hdi)}) program: [Research: Dvu](#{mp(dvu_study)}).",
      ntfn.english
    )
    assert_equal(
      "[Drew Mambo](/people/883742519) a ajouté une nouvelle activité au programme [Hdi](/languages/876048951) : [Research: Dvu](#{mp(dvu_study)}).",
      ntfn.french
    )
    assert_includes @abanda.notifications, ntfn
    assert_includes @nancy.notifications, ntfn
  end

  test 'Updated Person' do
    Notification.updated_person(@rick, @drew)
    ntfn = Notification.last
    assert_equal(
      "[Rick Conrad](#{mp(@rick)}) updated the info for [Drew Mambo](#{mp(@drew)}).",
      ntfn.english
    )
    assert_equal(
      '[Rick Conrad](/people/334915632) a mis à jour les infos pour [Drew Mambo](/people/883742519).',
      ntfn.french
    )
    assert_equal 1, ntfn.person_notifications.count
    assert_includes @drew.notifications, ntfn
  end

  test 'Gave Person Role' do
    Notification.gave_person_role(@rick, @drew, :Literacy_specialist)
    ntfn = Notification.last
    assert_equal(
      "[Rick Conrad](#{mp(@rick)}) gave the Literacy Specialist role to [Drew Mambo](#{mp(@drew)}).",
      ntfn.english
    )
    assert_equal(
      '[Rick Conrad](/people/334915632) a donné le rôle Spécialiste en alphabétisation à [Drew Mambo](/people/883742519).',
      ntfn.french
    )
    assert_equal 1, ntfn.person_notifications.count
    assert_includes @drew.notifications, ntfn
  end

  test 'Added people to activity' do
    hdi_exodus = translation_activities(:HdiExodus)
    Notification.added_people_to_activity(@rick, [@drew, @abanda], hdi_exodus)
    ntfn = Notification.last
    assert_equal(
      "[Rick Conrad](#{mp(@rick)}) added [Drew Mambo](#{mp(@drew)}) & [Abanda Dunno](#{mp(@abanda)}) to [Exodus](#{mp(hdi_exodus)}) for the [Hdi](#{mp(@hdi)}) program.",
      ntfn.english
    )
    assert_equal(
      '[Rick Conrad](/people/334915632) a ajouté [Drew Mambo](/people/883742519) & [Abanda Dunno](/people/751031655) à [Exode](/translation_activities/673450894) pour le programme [Hdi](/languages/876048951).',
      ntfn.french
    )
    assert_includes @abanda.notifications, ntfn
    assert_includes @nancy.notifications, ntfn
  end

  test 'Added people to event' do
    gen_checking = events(:HdiGenesisChecking)
    kendall = people(:Kendall)
    gen_checking.people << [@lance, kendall]
    ev_ptpts = gen_checking.event_participants.where(person: [@lance, kendall])
    Notification.added_people_to_event(@rick, ev_ptpts)
    ntfn = Notification.last
    assert_equal(
      "[Rick Conrad](#{mp(@rick)}) added [Lance Armstrong](#{mp(@lance)}) & [Kendall Ingles](#{mp(kendall)}) to the [Genesis Checking](#{mp(gen_checking)}) event.",
      ntfn.english
    )
    assert_equal(
      "[Rick Conrad](/people/334915632) a ajouté [Lance Armstrong](/people/704289197) & [Kendall Ingles](/people/356934054) à l'événement [Genesis Checking](/events/704985269).",
      ntfn.french
    )
    assert_includes @lance.notifications, ntfn
  end

  test 'New event for language' do
    event = @hdi.events.create(name: 'Exodus Checking', domain: :Translation, start_date: '2019-11-22', end_date: '2019-12-5')
    Notification.new_event_for_language(@drew, event, @hdi)
    ntfn = Notification.last
    assert_equal(
      "[Drew Mambo](#{mp(@drew)}) created the [Exodus Checking](#{mp(event)}) event for the [Hdi](#{mp(@hdi)}) program.",
      ntfn.english
    )
    assert_equal(
      "[Drew Mambo](/people/883742519) a créé l'événement [Exodus Checking](/events/) pour le programme [Hdi](/languages/876048951).",
      ntfn.french
    )
    assert_includes @abanda.notifications, ntfn
  end

  test 'Added language to event' do
    gen_checking = events(:HdiGenesisChecking)
    Notification.added_language_to_event(@drew, @hdi, gen_checking)
    ntfn = Notification.last
    assert_equal "[Drew Mambo](#{mp(@drew)}) added the [Hdi](#{mp(@hdi)}) program to the [Genesis Checking](#{mp(gen_checking)}) event.", ntfn.english
    assert_equal "[Drew Mambo](/people/883742519) a ajouté le programme [Hdi](/languages/876048951) à l'événement [Genesis Checking](/events/704985269).", ntfn.french
    assert_includes people(:Abanda).notifications, ntfn
    assert_includes people(:Nancy).notifications, ntfn
  end

  test 'Added cluster to event' do
    gen_checking = events(:HdiGenesisChecking)
    Notification.added_cluster_to_event(@rick, clusters(:Ndop), gen_checking)
    ntfn = Notification.last
    assert_equal "[Rick Conrad](#{mp(@rick)}) added the [Ndop](#{mp(clusters(:Ndop))}) cluster to the [Genesis Checking](#{mp(gen_checking)}) event.", ntfn.english
    assert_equal "[Rick Conrad](/people/334915632) a ajouté le groupe [Ndop](/clusters/657561020) à l'événement [Genesis Checking](/events/704985269).", ntfn.french
    assert_includes people(:Freddie).notifications, ntfn
    assert_includes people(:Nancy).notifications, ntfn
  end

  test 'Added Domain Status Item' do
    dsi = domain_status_items :HdiNT
    Notification.added_dsi(@rick, dsi)
    ntfn = Notification.last
    assert_equal "[Rick Conrad](#{mp(@rick)}) updated the translation status for [Hdi](#{mp(@hdi)}): [Published New Testament](#{mp(@hdi, dsi)}).", ntfn.english
    assert_equal "[Rick Conrad](#{mp(@rick)}) a mis à jour le statut de traduction de la langue [Hdi](#{mp(@hdi)}) : [Nouveau Testament publié](#{mp(@hdi, dsi)}).", ntfn.french
    assert_includes people(:Drew).notifications, ntfn
    assert_includes people(:Nancy).notifications, ntfn
  end
end
